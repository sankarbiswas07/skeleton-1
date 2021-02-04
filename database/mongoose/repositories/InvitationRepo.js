const Invitation = require("../models/invitation.js")

const InvitationRepo = {

  // To get details of invitation
  findById: id => Invitation.findOne({ _id: id, isAccepted: false })
    .select("+data +onModel +invitationOn +inviter +invitee")
    .populate({
      path: "inviter",
      select: ["name", "email", "phone"]
    })
    .populate("invitee")
    .populate("invitationOn")
    .lean()
    .exec(),

  findInvitations: options => Invitation
    .find(options)
    .populate({
      path: "inviter",
      select: ["-forgotPassword"]
    })
    .populate({
      path: "invitee",
      select: ["-forgotPassword"]
    })
    .populate({
      path: "invitationOn",
      select: ["-forgotPassword"]
    })
    .lean()
    .exec(),

  acceptInvitation: async (id, data) => Invitation
    .findByIdAndUpdate({ _id: id }, { isAccepted: true, ...data })
    .lean()
    .exec(),

  createInvitation: async ({
    inviter, invitationOn, onModel, invitee, data
  }) => {
    const invitation = await Invitation.create({
      inviter,
      invitee,
      invitationOn,
      onModel,
      data
    })
    return invitation.toObject()
  }
}

module.exports = InvitationRepo
