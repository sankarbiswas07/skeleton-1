const _ = require("lodash")
const crypto = require("crypto")
const asyncHandler = require("../../../../lib/core/asyncHandler")
const { frontEndLogin } = require("../../../../config")
const UserRepo = require("../../../../database/mongoose/repositories/UserRepo")
const InvitationRepo = require("../../../../database/mongoose/repositories/InvitationRepo")
const { SuccessResponse } = require("../../../../lib/core/apiResponse")
const { BadRequestError } = require("../../../../lib/core/apiError")
const { signupMail } = require("../../../../lib/core/mail")
const { assignTokens } = require("../../../../lib/core/tokenManagement")

module.exports = {
/**
   *
   * @api {post} /v1/auth/invitation/signup  2.1 Signup accept
   * @apiDescription Signup Invitation accept from user
   * @apiName signupInvitationAccept
   * @apiGroup Invitation
   * @apiVersion  1.0.0
   * @apiPermission Public
   *
   * @apiParam  {String} token user email
   * @apiParam  {String} password user name
   *
   * @apiHeader {String} x-api-key  Vendor ID.
   *
   * @apiParamExample  {json} Request-Example:
      {
          "token":"5ee2829642963316bbc2f357",
          "password":"qwerty"
      }
   *
   * @apiSuccessExample (200) {json} Success-Response:
{
    "statusCode": "10000",
    "message": "Signup invitation Accepted",
    "data": {
        "user": {
            "_id": "5ee282dd42963316bbc2f358",
            "name": {
                "first": "Sankar",
                "last": "Prasad Biswas",
                "full": "Sankar Prasad Biswas"
            },
            "email": "sankarbiswas07+555@gmail.com",
            "roles": [
                "5ec023317f06787780f9e52a"
            ]
        },
        "tokens": {
            "accessToken": "eyJhb.eyJpc3MiOiJtaW51Lmluc3RhY2t5RmMDZlMTAyNTI0NjgifQ.KKGSE4pY1dflQqGj4GN1wifbVsIsTg",
            "refreshToken": "eyJhb.eyJpc3MiOiJtaW51Lmluc3RhY2t5RmMDZlMTAyNTI0NjgifQ.KKGSE4pY1dflQqGj4GN1wifbVsIsTg"
        }
    }
}
   *
   *
   */
  signupInvitationAcceptance: asyncHandler(async (req, res) => {
    const {
      password, token
    } = req.body
    const invitation = await InvitationRepo.findById(token)
    if (!invitation) throw BadRequestError("Invitation expired")
    const { email, name, phone } = invitation.data
    const isExistUser = await UserRepo.findByEmail(email)
    if (isExistUser) throw BadRequestError("User already registered")
    if (invitation.onModel !== "User") throw BadRequestError() // Warning if failed, something suspicious

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
    // deactivate invitation, Update other data for future use
    InvitationRepo.acceptInvitation(token, {
      invitationOn: createdUser._id,
      invitee: createdUser._id
    })
    // send email
    signupMail(createdUser.email, {
      _id: createdUser._id,
      email: createdUser.email,
      name: createdUser.name,
      password,
      loginPath: frontEndLogin
    })
    return SuccessResponse(res, "Signup invitation Accepted", {
      user: _.pick(createdUser, ["_id", "name", "email", "roles", "profilePicUrl"]),
      tokens
    })
  })
}
