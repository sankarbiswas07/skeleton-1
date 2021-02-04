const _ = require("lodash")
const { AuthFailureError } = require("../core/apiError")
const RoleRepo = require("../../database/mongoose/repositories/RoleRepo")
const asyncHandler = require("../core/asyncHandler")


// return truthy object(marge)
const __customized = (objVal, nextVal) => Object.assign(
  {},
  _.pickBy(objVal), // return keys which has truthy value
  _.pickBy(nextVal)
)

const _filterRoles = (hasRoles, needRoles) => {
  const takeAuth = {
    roleMatched: 0,
    maxRights: {}
  }
  needRoles.forEach((role) => {
    if (hasRoles.indexOf(role._id.toHexString()) !== -1) {
      takeAuth.roleMatched += 1
      takeAuth.maxRights = __customized(takeAuth.maxRights, role.rights)
    }
  })
  return takeAuth
}

// eslint-disable-next-line import/prefer-default-export
module.exports = {
  hasRights: type => asyncHandler(async (req, res, next) => {
    if (!req.user || !req.user.roles || !req.user.roles.length > 0 || !req.hasRoles.length > 0) throw AuthFailureError("Permission denied")

    const roles = await RoleRepo.findByCodes(req.hasRoles)
    if (!roles.length) throw AuthFailureError("Permission denied")

    const validRoles = _filterRoles(
      req.user.roles.map(e => e._id.toHexString()),
      roles,
    )

    if (validRoles.roleMatched === 0) throw AuthFailureError("Permission denied")
    // if undefined or false
    if (!validRoles.maxRights[req.method][type]) throw AuthFailureError("Permission denied")

    req.user.hasRights = validRoles.maxRights
    return next()
  })
}
