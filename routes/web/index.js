const express = require("express")
const asyncHandler = require("../../lib/core/asyncHandler")
const UserRepo = require("../../database/mongoose/repositories/UserRepo")
const ApiKeyRepo = require("../../database/mongoose/repositories/ApiKeyRepo")
const { BadRequestError } = require("../../lib/core/apiError")
const { SuccessResponse } = require("../../lib/core/apiResponse")
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


router.get("/login", asyncHandler(async (req, res) => {
  const {
    clientId: apiKey,
    redirectUri,
    scope,
    responseType,
    state,
  } = req.query
  // console.log("apiKey", apiKey)

  const client = await ApiKeyRepo.findByKey(apiKey)
  // validation
  if (client === null) throw BadRequestError("clientId is not registered  !!!")
  if (client.redirectUri !== redirectUri) throw BadRequestError("redirectUri is not registered !!!")

  return res.render("login", {
    apiKey, frontEndLogin
  })
}))

module.exports = router
