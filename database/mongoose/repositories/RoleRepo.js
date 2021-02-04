const Role = require("../models/role")

const RoleRepo = {
  findByCode: async code => Role
    .findOne({ code, isActive: true })
    .lean()
    .exec(),

  findByCodeOnly: async code => Role
    .findOne({ code })
    .lean()
    .exec(),

  findByCodes: async codes => Role
    .find({ isActive: true, code: { $in: codes } })
    .lean()
    .exec(),

  findAllRoleRights: () => Role.find({}).lean().exec(),
  // don't use, role shouldn't be dynamic created
  // as middleware should dependent on role
  // createRole: async role => Role.create(role),

  createRightsForAllRole: async (rightName, defaultPermission = false) => {
    // add new rightName with defaultPermission as value to all roles
    const $set = {}
    $set[`rights.POST.${rightName}`] = defaultPermission
    $set[`rights.PATCH.${rightName}`] = defaultPermission
    $set[`rights.PUT.${rightName}`] = defaultPermission
    $set[`rights.DELETE.${rightName}`] = defaultPermission
    $set[`rights.GET.${rightName}`] = defaultPermission
    await Role
      .updateMany(
        {},
        { $set }
      ).exec()
    return { rightName, defaultPermission }
  },

  updateOneRight: async (code, method, rightName, status) => {
    const $set = {}
    $set[`rights.${method}.${rightName}`] = status
    await Role.updateOne({ code }, { $set }).exec()
    return {
      code, method, rightName, status
    }
  }
}

module.exports = RoleRepo
