const Role = require("../models/role")

const RoleRepo = {
  findByCode: async code => Role.findOne({ code, status: true }).lean().exec()
}

module.exports = RoleRepo
