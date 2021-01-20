const mongoose = require("mongoose")
const { model, Schema } = mongoose

const DOCUMENT_NAME = "Role"
const COLLECTION_NAME = "roles"

const schema = new Schema({
  code: {
    type: String,
    required: true,
    enum: [
      "ADMIN",
      "USER",
    ]
  },
  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

schema.set("toJSON", { virtuals: true })
schema.set("toObject", { virtuals: true })

const Role = model(DOCUMENT_NAME, schema, COLLECTION_NAME)

module.exports = Role
