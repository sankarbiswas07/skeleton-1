const mongoose = require("mongoose")
const { model, Schema } = mongoose

const DOCUMENT_NAME = "ApiKey"
const COLLECTION_NAME = "api_keys"

const schema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    maxlength: 1024
  },
  version: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  metadata: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true
  }
}, { versionKey: false, timestamps: true })

schema.set("toJSON", { virtuals: true })
schema.set("toObject", { virtuals: true })

module.exports = model(DOCUMENT_NAME, schema, COLLECTION_NAME)
