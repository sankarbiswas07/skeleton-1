const _ = require("lodash")
const { assignTokens } = require("../../../../lib/core/tokenManagement")
const UserRepo = require("../../../../database/mongoose/repositories/UserRepo")

const logout = (req, res) => { res.status(200) }

module.exports = logout
