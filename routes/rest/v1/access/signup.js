const _ = require("lodash")
const crypto = require("crypto")
const asyncHandler = require("../../../../lib/core/asyncHandler")
const UserRepo = require("../../../../database/mongoose/repositories/UserRepo")
const { assignTokens } = require("../../../../lib/core/tokenManagement")
const { SuccessResponse } = require("../../../../lib/core/apiResponse")
const { BadRequestError } = require("../../../../lib/core/apiError")

/**
   *
   * @api {post} /v1/auth/signup User registration
   * @apiName userRegistration
   * @apiGroup Auth
   * @apiVersion  1.0.0
   * @apiPermission Public
   *
   * @apiHeader {String} x-api-key API key to access enter the server
   *
   * @apiParam  {String} email
   * @apiParam  {Object} [phone]
   * @apiParam  {String} phone.countryCode
   * @apiParam  {String} phone.number
   * @apiParam  {Object} name
   * @apiParam  {String} name.first
   * @apiParam  {String} [name.last]
   * @apiParam  {String} [password]
   *
   *
   * @apiSuccess (200) {json} name description
   *
   * @apiParamExample  {json} Request-Example:
   * {
   *     "email" : "sankarbiswas07@gmail.com",
   *     "phone": {
              "countryCode": "91",
              "number": "8961766682"
          },
   *     "name"  :{
   *          "first":"sankar",
   *          "last" :"prasad biswas"
   *      }
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     "error" : false,
   *      tokens: {
            accessToken: "encryptionDetails.payload.signature",
            refreshToken: "encryptionDetails.payload.signature"
          }
   * }
   *
   *
   */
const signup = asyncHandler(async (req, res) => {
  const {
    email, phone, name, password
  } = req.body
  if (email === undefined) {
    throw BadRequestError("Required email address")
  }
  if (name === undefined || name.first === undefined || name.first.trim() === "") {
    throw BadRequestError("Required first name")
  }
  const isExistUser = await UserRepo.findByEmail(req.body.email)
  if (isExistUser) throw BadRequestError("User already registered")

  const accessTokenKey = crypto.randomBytes(64).toString("hex")
  const refreshTokenKey = crypto.randomBytes(64).toString("hex")

  const { user: createdUser, keystore } = await UserRepo.create({
    email,
    phone,
    password,
    name
  }, "USER", accessTokenKey, refreshTokenKey)

  // token
  const { tokens } = await assignTokens(
    createdUser,
    keystore.primaryKey,
    keystore.secondaryKey
  )
  return SuccessResponse(res, "Signup Successful", {
    user: _.pick(createdUser, ["_id", "name", "email", "roles", "profilePicUrl"]),
    tokens
  })
})

module.exports = signup
