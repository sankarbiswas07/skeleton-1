const _ = require("lodash")
const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const asyncHandler = require("../../../../lib/core/asyncHandler")
const UserRepo = require("../../../../database/mongoose/repositories/UserRepo")
const KeystoreRepo = require("../../../../database/mongoose/repositories/KeystoreRepo")
const { assignTokens } = require("../../../../lib/core/tokenManagement")
const { SuccessResponse } = require("../../../../lib/core/apiResponse")
const { BadRequestError, AuthFailureError } = require("../../../../lib/core/apiError")


/**
   *
   * @api {post} /v1/auth/login User Login
   * @apiName userLogin
   * @apiGroup Auth
   * @apiVersion  1.0.0
   * @apiPermission Public
   *
   * @apiHeader {String} x-api-key API key to access enter the server
   *
   * @apiParam  {String} email
   * @apiParam  {String} password
   *
   *
   * @apiSuccess (200) {json} name description
   *
   * @apiParamExample  {json} Request-Example:
   * {
   *     "email" : "sankarbiswas07@gmail.com",
   *     "password" : "thisIsNotPass",
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
    {
      "statusCode": "10000",
      "message": "Signup Successful",
      "data": {
          "user": {
              "_id": "6008176562ec703afa55c874",
              "name": {
                  "first": "sankar",
                  "last": "prasad biswas"
              },
              "email": "sankarbiswas07+3@gmail.com",
              "roles": [
                  {
                      "_id": "600802c13af8036e2be5d13c",
                      "code": "USER"
                  }
              ]
          },
          "tokens": {
              "accessToken": "jwt.access.token",
              "refreshToken": "jwt.refresh.token"
          }
      }
    }
   *
   *
   */
const login = asyncHandler(async (req, res) => {
  const user = await UserRepo.findByEmail(req.body.email)
  if (!user) throw BadRequestError("User not registered")
  if (!user.password) throw BadRequestError("Credential not set")

  const match = await bcrypt.compare(req.body.password, user.password)
  if (!match) throw AuthFailureError("Authentication failure")

  const accessTokenKey = crypto.randomBytes(64).toString("hex")
  const refreshTokenKey = crypto.randomBytes(64).toString("hex")
  await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey)
  // token
  const { tokens } = await assignTokens(user._id, accessTokenKey, refreshTokenKey)

  return SuccessResponse(res, "Signup Successful", {
    user: _.pick(user, ["_id", "name", "email", "roles", "profilePicUrl"]),
    tokens
  })
})

module.exports = login
