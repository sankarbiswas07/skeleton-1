const express = require("express")
const asyncHandler = require("../../lib/core/asyncHandler")
const UserRepo = require("../../database/mongoose/repositories/UserRepo")
const { BadRequestError } = require("../../lib/core/apiError")
const { frontEndLogin } = require("../../config")
const router = express.Router()

router.get("/resetPassword/:token/:apiKey", asyncHandler(async (req, res) => {
  const { token, apiKey } = req.params
  const user = await UserRepo.findForgotPasswordUser(token)
  if (user === null) throw BadRequestError("Invalid or expired token")
  return res.render("resetPassword", {
    email: user.email, token, apiKey, frontEndLogin
  })
}))

module.exports = router
