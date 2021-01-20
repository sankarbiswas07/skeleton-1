const mongoose = require("mongoose")
const { model, Schema } = mongoose

const DOCUMENT_NAME = "Keystore"
const COLLECTION_NAME = "keystores"

const schema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    index: true
  },
  primaryKey: {
    type: Schema.Types.String,
    required: true,
    index: true
  },
  secondaryKey: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: Boolean,
    default: true
  }
}, { versionKey: false, timestamps: true })

schema.set("toJSON", { virtuals: true })
schema.set("toObject", { virtuals: true })

const Keystore = model(DOCUMENT_NAME, schema, COLLECTION_NAME)

module.exports = Keystore
