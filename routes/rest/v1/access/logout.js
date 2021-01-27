const asyncHandler = require("../../../../lib/core/asyncHandler")
const KeystoreRepo = require("../../../../database/mongoose/repositories/KeystoreRepo")
const { SuccessMsgResponse } = require("../../../../lib/core/apiResponse")

const logout = asyncHandler(async (req, res) => {
  if (req.params.fromAllDevices === "yes") {
    await KeystoreRepo.removeAll(req.user._id)
  } else {
    await KeystoreRepo.remove(req.keystore._id)
  }
  return SuccessMsgResponse(res, "Logout success")
})

module.exports = logout
