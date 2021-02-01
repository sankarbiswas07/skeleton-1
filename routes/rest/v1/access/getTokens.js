const _ = require("lodash")
const asyncHandler = require("../../../../lib/core/asyncHandler")
const UserRepo = require("../../../../database/mongoose/repositories/UserRepo")
const KeystoreRepo = require("../../../../database/mongoose/repositories/KeystoreRepo")
const { assignTokens } = require("../../../../lib/core/tokenManagement")
const { SuccessResponse } = require("../../../../lib/core/apiResponse")
const { BadRequestError, AuthFailureError } = require("../../../../lib/core/apiError")


/**
   *
   * @api {post} /v1/auth/getTokens User Login
   * @apiName userLogin
   * @apiGroup Auth
   * @apiVersion  1.0.0
   * @apiPermission Public
   *
   * @apiHeader {String} x-access-token Access token to get the bearer token
   * @apiHeader {String} x-user-id owner of the access token for validation
   *
   *
   *
   * @apiSuccess (200) {json} name description
   *
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
const getToken = asyncHandler(async (req, res) => {
  const accessTokenKey = req.headers["x-access-token"]
  const requestedUserId = req.headers["x-user-id"]
  const user = await UserRepo.findById(requestedUserId)

  if (!user) throw BadRequestError("User not registered")
  if (!user.password) throw BadRequestError("Credential not set")

  const keystore = await KeystoreRepo
    .findForKey(requestedUserId, accessTokenKey)

  if (!keystore) throw AuthFailureError("Invalid access token")

  req.keystore = keystore

  // token
  const tokens = await assignTokens({
    data: user,
    primaryKey: keystore.primaryKey,
    secondaryKey: keystore.secondaryKey
  })

  return SuccessResponse(res, "Signup Successful", {
    user: _.pick(user, ["_id"]),
    client: _.pick(req.client, ["redirectUri", "key"]),
    tokens
  })
})

module.exports = getToken
