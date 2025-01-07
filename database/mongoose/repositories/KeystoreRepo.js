const Keystore = require("../models/keystore")

const KeystoreRepo = {

  findForKey: (client, key) => Keystore
    .findOne({ client, primaryKey: key, status: true })
    .exec(),

  remove: id => Keystore
    .findByIdAndDelete(id)
    .lean()
    .exec(),

  removeAll: client => Keystore
    .deleteMany({ client })
    .lean()
    .exec(),

  find: (client, primaryKey, secondaryKey) => Keystore
    .findOne({ client, primaryKey, secondaryKey })
    .lean()
    .exec(),

  create: async (client, primaryKey, secondaryKey) => {
    const now = new Date()
    const keystore = await Keystore.create({
      client,
      primaryKey,
      secondaryKey,
      createdAt: now,
      updatedAt: now
    })
    return keystore.toObject()
  }
}

module.exports = KeystoreRepo
