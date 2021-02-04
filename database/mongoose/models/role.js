const mongoose = require("mongoose")
const { model, Schema } = mongoose

const { RoleCode } = require("../../../lib/helper/declaration")

const DOCUMENT_NAME = "Role"
const COLLECTION_NAME = "roles"

const schema = new Schema({
  code: {
    type: String,
    required: true,
    enum: [
      RoleCode.ADMIN,
      RoleCode.USER,
      RoleCode.SUPER
    ]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rights: {
    POST: {
      type: Map,
      of: Boolean,
      default: false
    },
    PUT: {
      type: Map,
      of: Boolean,
      default: false
    },
    PATCH: {
      type: Map,
      of: Boolean,
      default: false
    },
    DELETE: {
      type: Map,
      of: Boolean,
      default: false
    },
    GET: {
      type: Map,
      of: Boolean,
      default: false
    },
  }
}, { timestamps: true })

schema.set("toJSON", { virtuals: true })
schema.set("toObject", { virtuals: true })

const Role = model(DOCUMENT_NAME, schema, COLLECTION_NAME)

module.exports = Role
