module.exports = {
  checkInRoles: roleCodes => (req, res, next) => {
    req.hasRoles = roleCodes
    next()
  }
}
