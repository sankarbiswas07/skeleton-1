const crypto = require("crypto")
const mongoose = require("mongoose")
const asyncHandler = require("../../../../lib/core/asyncHandler")
const UserRepo = require("../../../../database/mongoose/repositories/UserRepo")
const KeystoreRepo = require("../../../../database/mongoose/repositories/KeystoreRepo")
const { tokenInfo } = require("../../../../config")
const {
  assignTokens, decodeToken,
  verifyToken, validateTokenData
} = require("../../../../lib/core/tokenManagement")

const { TokenRefreshResponse } = require("../../../../lib/core/apiResponse")
const { AuthFailureError } = require("../../../../lib/core/apiError")


/**
   *
   * @api {post} /v1/auth/refresh User refresh token
   * @apiName userRefreshToken
   * @apiGroup Auth
   * @apiVersion  1.0.0
   * @apiPermission Public
   *
   * @apiHeader {String} x-api-key API key to access enter the server
   * @apiHeader {String} x-access-token JWT access token
   * @apiHeader {String} x-user-id UserId
   *
   * @apiParam  {String} email
   * @apiParam  {String} password
   *
   *
   * @apiSuccess (200) {json} name description
   *
   * @apiParamExample  {json} Request-Example:
   * {
   *     "refreshToken" : "jwt.refresh.token"
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
    {
      "statusCode": "10000",
      "message": "Token Issued",
      "data": {
          "tokens": {
              "accessToken": "jwt.access.token",
              "refreshToken": "jwt.refresh.token"
          }
      }
    }
   *
   *
   */


const refreshToken = asyncHandler(async (req, res) => {
  
  const [bearer_prefix, jwt_token] = (req.headers["authorization"]).split(" ")

  if (!bearer_prefix) throw ForbiddenError()
  if (!jwt_token) throw ForbiddenError()

  req.accessToken = jwt_token.trim()

  const user = await UserRepo.findById(req.headers["x-user-id"].toString())
  if (!user) throw AuthFailureError("User not registered")
  req.user = user

  // JWT token meta validation option
  const option = {
    iss: tokenInfo.issuer,
    aud: tokenInfo.audience,
    sub: req.user._id.toHexString()
  }

  const accessTokenPayload = await validateTokenData(
    req.user._id,
    await decodeToken(req.accessToken, option)
  )

  const refreshTokenPayload = await validateTokenData(
    req.user._id,
    await verifyToken(req.body.refreshToken, option)
  )

  const keystore = await KeystoreRepo.find(
    req.user._id,
    accessTokenPayload.prm,
    refreshTokenPayload.prm
  )

  if (!keystore) throw AuthFailureError("Invalid access token")
  await KeystoreRepo.remove(keystore._id)

  const accessTokenKey = crypto.randomBytes(64).toString("hex")
  const refreshTokenKey = crypto.randomBytes(64).toString("hex")

  await KeystoreRepo.create(req.user._id, accessTokenKey, refreshTokenKey)
  const tokens = await assignTokens(req.user, accessTokenKey, refreshTokenKey)

  return TokenRefreshResponse(res, "Token Issued", tokens)
})

module.exports = refreshToken
