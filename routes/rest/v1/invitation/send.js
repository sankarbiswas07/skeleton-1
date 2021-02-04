const _ = require("lodash")
const asyncHandler = require("../../../../lib/core/asyncHandler")
const { signupInvitationBase } = require("../../../../config")
const UserRepo = require("../../../../database/mongoose/repositories/UserRepo")
const InvitationRepo = require("../../../../database/mongoose/repositories/InvitationRepo")
const { SuccessMsgResponse } = require("../../../../lib/core/apiResponse")
const { BadRequestError } = require("../../../../lib/core/apiError")
const { invitationMail } = require("../../../../lib/core/mail")


const invitationModelReference = {
  User: "signup"
}

module.exports = {
  /**
       *
       * @api {post} /v1/auth/invitation/signup 2.0 Signup send
       * @apiDescription Signup Invitation from an Authenticated User(admin) link format - `frontendBasePath/apikey/token`
       * @apiName signupInvitationSend
       * @apiGroup Invitation
       * @apiVersion  1.0.0
       * @apiPermission Authenticated
       * @apiPermission Admin
       *
       * @apiParam  {String} email user email
       * @apiParam  {String} name user name
       * @apiParam  {String} [phone] user phone
       *
       * @apiHeader {String} x-user-id  User ID.
       * @apiHeader {String} x-api-key  Vendor ID.
       * @apiHeader {String} Authorization  Bearer Access token.
       *
       * @apiParamExample  {json} Request-Example:
       * {
       *     "email": "sankarbiswas07@hotmail.com"
       *     "name": {"first":"sankar", "last": "prasad biswas"},
       *     "phone": ""
       * }
       *
       * @apiSuccessExample (200) {json} Success-Response:
        {
            "statusCode": "10000",
            "message": "Signup invitation sent"
        }
       *
       *
       */
  signup: asyncHandler(async (req, res) => {
    const {
      email, phone, name
    } = req.body
    const { user } = req
    const isExistUser = await UserRepo.findByEmail(req.body.email)
    if (isExistUser) throw BadRequestError("User already registered")
    // validation:
    // same invitee, inviter & invitationOn check logic for limiting spam
    const invitation = await InvitationRepo.createInvitation({
      inviter: user._id,
      onModel: "User",
      data: {
        email, phone, name
      }
    })

    // send email with link
    invitationMail(invitation.data.email, {
      _id: invitation._id,
      invitee: { email: invitation.data.email, name: invitation.data.name },
      inviter: { email: user.email, name: user.name },
      reason: invitationModelReference[invitation.onModel],
      invitationPath: `${signupInvitationBase}/${req.apiKey}/${invitation._id}`
    })
    return SuccessMsgResponse(res, "Signup invitation sent")
  })
}
