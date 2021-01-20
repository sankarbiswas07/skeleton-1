const User = require("../models/user")
const Role = require("../models/role")
const KeystoreRepo = require("./KeystoreRepo")

const UserRepo = {
  findById: id => User.findOne({ _id: id, isActive: true })
    .select("+email +password +roles")
    .populate({
      path: "roles",
      match: { isActive: true }
    })
    .lean()
    .exec(),

  // Find user by email
  findByEmail: email => User.findOne({ email, isActive: true })
    .select("+email +password +roles")
    .populate({
      path: "roles",
      match: { status: true },
      select: { code: 1 }
    })
    .lean()
    .exec(),

  // Find a user by _id
  findProfileById: id => User.findOne({ _id: id, isActive: true })
    .select("+roles")
    .populate({
      path: "roles",
      match: { status: true },
      select: { code: 1 }
    })
    .lean()
    .exec(),

  // Create User
  create: async (user, roleCode, accessTokenKey, refreshTokenKey) => {
    const role = await Role.findOne({ code: roleCode }).lean().exec()
    if (!role) throw new Error("Role must be defined")
    // eslint-disable-next-line no-param-reassign
    user.roles = [role._id]

    const createdUser = await User.create(user)
    const keystore = await KeystoreRepo
      .create(createdUser._id, accessTokenKey, refreshTokenKey)
    return { user: createdUser.toObject(), keystore }
  },

  // Update user
  update: async (user) => {
    await User
      .updateOne({ _id: user._id }, { $set: { ...user } }).lean().exec()
    return { user }
  }
}

module.exports = UserRepo
