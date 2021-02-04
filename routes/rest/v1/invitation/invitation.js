const _ = require("lodash")
const asyncHandler = require("../../../../lib/core/asyncHandler")
const UserRepo = require("../../../../database/mongoose/repositories/UserRepo")
const InvitationRepo = require("../../../../database/mongoose/repositories/InvitationRepo")
const { SuccessResponse } = require("../../../../lib/core/apiResponse")
const { BadRequestError } = require("../../../../lib/core/apiError")

//------------------------------------------------
//                                  PRIVATE TYPES
//------------------------------------------------
const invitationReference = {
  signup: "User"
}


module.exports = {
// Signup Invitation from an Authenticated User
/**
   *
   * @api {get} /v1/auth/invitation/list?type=signup&status=accepted  1.0 Invitation list
   * @apiDescription All Invitation list by few filter options (under construction), if admin then only his invitations, if super fetch all(pending)
   * @apiName signupInvitationList
   * @apiGroup Invitation
   * @apiVersion  1.0.0
   * @apiPermission Authenticated
   * @apiPermission Admin
   *
   * @apiParam  {String} invited enum=[invited, accepted]
   * @apiParam  {String} type invitation type enum=[signup]
   * @apiParam  {String} [invitee] Invitee(user) ID
   *
   * @apiHeader {String} x-user-id  User ID.
   * @apiHeader {String} x-api-key  Vendor ID.
   * @apiHeader {String} Authorization  Bearer Access token.
   *
   *
   * @apiSuccessExample (200) {json} Success-Response:
    {
    "statusCode": "10000",
    "message": "Invitation list",
    "data": {
        "invitations": [
            {
                "_id": "5ede8c7c5f73cb183e624d2d",
                "isAccepted": true,
                "inviter": {
                    "_id": "5ec050b9cc60d22e31bdc16d",
                    "forgotpassword": {
                        "requestedAt": null,
                        "token": null,
                        "expiresAt": null
                    },
                    "isActive": true,
                    "email": "sankarbiswas07@gmail.com",
                    "phone": "1231231234",
                    "name": {
                        "first": "sankar",
                        "last": "prasad biswas"
                    },
                    "createdAt": "2020-05-16T20:44:41.458Z",
                    "updatedAt": "2020-06-07T20:58:24.095Z",
                    "__v": 0,
                    "updatedBy": "5ec050b9cc60d22e31bdc16d"
                },
                "onModel": "User",
                "data": {
                    "email": "sankarbiswas07+192@gmail.com",
                    "phone": "1231231234",
                    "name": {
                        "first": "Sankar",
                        "last": "Prasad Biswas"
                    }
                }
              ]
            }
          }
   *
   *
   */
  list: asyncHandler(async (req, res) => {
    const {
      type, status, invitee
    } = req.query
    const { user } = req

    // validation:
    // same invitee, inviter & invitationOn check logic for limiting spam
    const option = {
      inviter: user._id,
      isAccepted: status !== "invited",
      onModel: invitationReference[type]
    }
    if (invitee && invitee.trim() !== "") option.invitee = invitee
    const invitations = await InvitationRepo.findInvitations(option)
    // send email with link
    return SuccessResponse(res, "Invitation list", { invitations })
  })
}
