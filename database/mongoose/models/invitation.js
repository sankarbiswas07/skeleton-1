const mongoose = require("mongoose")
const { model, Schema } = mongoose

const DOCUMENT_NAME = "Invitation"
const COLLECTION_NAME = "invitations"

// Inviter - someone who invites
// Invitee - someone who is invited
// on - _id of onModel (where you will maintain status on invitation)
// onModel - is the Model name of `on` key's ID
const schema = new Schema({
  inviter: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  invitee: {
    type: Schema.Types.ObjectId,
    // required: true, // invitee can not be available all the time eg. signup
    ref: "User"
  },
  // https://mongoosejs.com/docs/populate.html#dynamic-ref
  invitationOn: {
    type: Schema.Types.ObjectId,
    // required: true,
    refPath: "onModel"
  },
  onModel: {
    type: String,
    required: true,
    enum: [
      "User"
    ]
  },
  data: Object, // Minimum Data which will transfer to main model when accept invitation
  isAccepted: {
    type: Boolean,
    required: true,
    default: false
  }
}, { versionKey: false, timestamps: true })

schema.set("toJSON", { virtuals: true })
schema.set("toObject", { virtuals: true })

const Invitation = model(DOCUMENT_NAME, schema, COLLECTION_NAME)

module.exports = Invitation
