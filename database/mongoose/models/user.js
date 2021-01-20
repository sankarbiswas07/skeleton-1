const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
// const logger  = require("../../../lib/core/logger")
const mailer = require("../../../lib/core/mail")
const { model, Schema } = mongoose
const DOCUMENT_NAME = "User"
const COLLECTION_NAME = "users"

const schema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },

  phone: {
    countryCode: String,
    number: String
  },

  password: {
    type: String,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  },

  name: {
    first: {
      type: String,
    },
    last: {
      type: String
    },
  },

  roles: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: "Role"
    }],
    required: true,
    select: false
  },

  forgotPassword: {
    requestedAt: { type: Date, default: null },
    token: { type: String, default: null },
    expiresAt: { type: Date, default: null }
  }
}, { timestamps: true })

// schema.pre("validate", function (next) {
//   if (this.isNew) {
//     if (this.password === undefined || this.password === null) {
//       this.generatedPassword = randomstring.generate(8) // for usage in post save hook to send welcome email
//       this.password = this.generatedPassword
//     }
//   }
//   return next()
// })

// Hash & save user's password:
schema.pre("save", async function (next) {
  const user = this
  if (this.isModified("password") || this.isNew) {
    try {
      user.generatedPassword = user.password
      user.password = await bcrypt
        .hash(user.password, +process.env.SALT_ROUNDS || 10)
    } catch (error) {
      return next(error)
    }
  }
  return next()
})

// compare two passwords:
schema.methods.comparePassword = async function (pw) {
  try {
    const isMatch = await bcrypt.compare(pw, this.password)
    if (isMatch === false) throw new Error("Credential Mismatch!")
  } catch (error) {
    throw error // rethrow
  }
}
// eslint-disable-next-line prefer-arrow-callback
schema.post("save", function (doc) {
  if (doc.generatedPassword !== undefined) {
    // Send welcome email, but NO WAITING!
    // logger.info(`doc.generatedPassword-  ${doc.generatedPassword}`)
    mailer("welcome", {
      to: doc.email,
      subject: "Welcome!!!",
      locals: {
        email: doc.email,
        password: doc.generatedPassword,
        name: doc.name
      }
    })
  }
})

schema.virtual("name.full").get(function () {
  const first = (this.name.first === undefined || this.name.first === null)
    ? ""
    : this.name.first
  const last = (this.name.last === undefined || this.name.last === null)
    ? ""
    : ` ${this.name.last}`
  return `${first}${last}`
})

schema.virtual("name.full").set(function (v) {
  this.name.first = v.substr(0, v.indexOf(" "))
  this.name.last = v.substr(v.indexOf(" ") + 1)
})

schema.set("toJSON", { virtuals: true })
schema.set("toObject", { virtuals: true })

const User = model(DOCUMENT_NAME, schema, COLLECTION_NAME)

module.exports = User
