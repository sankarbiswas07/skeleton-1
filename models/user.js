const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  name: {
    first: {
      type: String,
    },
    last: {
      type: String
    },
  },

  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })


UserSchema.set("toJSON", { virtuals: true })
UserSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("User", UserSchema)
