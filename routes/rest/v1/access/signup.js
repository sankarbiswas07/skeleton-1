const _ = require("lodash")
const crypto = require("crypto")
const asyncHandler = require("../../../../lib/core/asyncHandler")
const UserRepo = require("../../../../database/mongoose/repositories/UserRepo")
const { assignTokens } = require("../../../../lib/core/tokenManagement")
const { SuccessResponse } = require("../../../../lib/core/apiResponse")
const { BadRequestError } = require("../../../../lib/core/apiError")
const { signupMail } = require("../../../../lib/core/mail")
const { frontEndLogin } = require("../../../../config")

/**
   *
   * @api {post} /v1/auth/signup 1.0 User registration
   * @apiName userRegistration
   * @apiGroup Auth
   * @apiVersion  1.0.0
   * @apiPermission Public
   *
   * @apiHeader {String} x-api-key  Vendor ID.
   *
   * @apiParam  {String} email
   * @apiParam  {String} phone
   * @apiParam  {Object} name
   * @apiParam  {String} password
   *
   * @apiSuccess (200) {json} name description
   *
   * @apiParamExample  {json} Request-Example:
   * {
   *     "email" : "sankarbiswas07@gmail.com",
   *     "phone" : "+91891766682",
   *     "name"  :{
   *          "first":"sankar",
   *          "last" :"prasad biswas"
   *      }
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
{
    "statusCode": "10000",
    "message": "Signup Successful",
    "data": {
        "user": {
            "_id": "5ed6856f27c3b633f92bc28e",
            "name": {
                "first": "sankar",
                "last": "prasad biswas"
                "full": "sankar "prasad biswas"
            },
            "email": "sankarbiswas07@gmail.com",
            "roles": [
                "5ec023317f06787780f9e52a"
            ]
        },
        "tokens": {
            "accessToken": "eyJhbGc.DZlMjIwMzJkZTVmZTAwYmRmZWJmN2Q0OWNmY2U4ZTExOWM3MjQ0YzkxMWRlODRlNmIzNGMifQ.eQfR2xd-PX7tPLgeOF_lsOBmrA",
            "refreshToken": "eyJhbGc.DZlMjIwMzJkZTVmZTAwYmRmZWJmN2Q0OWNmY2U4ZTExOWM3MjQ0YzkxMWRlODRlNmIzNGMifQ.eQfR2xd-PX7tPLgeOF_lsOBmrA"
          }
    }
}
   *
   *
   */
const signup = asyncHandler(async (req, res) => {
  const {
    email, phone, name, password
  } = req.body

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
  const tokens = await assignTokens(
    createdUser,
    keystore.primaryKey,
    keystore.secondaryKey
  )
  // send email
  signupMail(createdUser.email, {
    _id: createdUser._id,
    email: createdUser.email,
    name: createdUser.name,
    password,
    loginPath: frontEndLogin
  })
  return SuccessResponse(res, "Signup Successful", {
    user: _.pick(createdUser, ["_id", "name", "email", "roles", "profilePicUrl"]),
    tokens
  })
})

module.exports = signup
