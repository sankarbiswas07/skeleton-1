const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const moment = require("moment")
const { siteUrl, frontEndLogin } = require("../../../../config")
const asyncHandler = require("../../../../lib/core/asyncHandler")
const UserRepo = require("../../../../database/mongoose/repositories/UserRepo")
const KeystoreRepo = require("../../../../database/mongoose/repositories/KeystoreRepo")
const { SuccessResponse, SuccessMsgResponse } = require("../../../../lib/core/apiResponse")
const { BadRequestError } = require("../../../../lib/core/apiError")
const { forgotMail, resetPasswordMail, setPasswordMail } = require("../../../../lib/core/mail")
const { assignTokens } = require("../../../../lib/core/tokenManagement")


module.exports = {
  issueForgetPassword: asyncHandler(async (req, res) => {
    const { email } = req.body
    const user = await UserRepo.findByEmail(email)
    if (!user) throw BadRequestError("User not found")
    req.user = user

    // store forget password request
    const now = Date.now()
    const forgotPassword = {
      requestedAt: now,
      token: crypto.randomBytes(64).toString("hex"),
      // expiresAt: moment(now).add(10, "days").toDate()
      expiresAt: moment(now).add(65, "minutes").toDate()
    }
    await UserRepo.update({
      _id: user._id,
      forgotPassword
    })

    // Mail should be triggered here (with reset password link - resetPasswordLink)
    // Which will open a html page from backend which will reset the password
    const resetPasswordLink = `${siteUrl}/w1/resetPassword/${forgotPassword.token}/${req.apiKey}`
    // Send Email
    forgotMail(user.email, {
      _id: user._id,
      email: user.email,
      name: user.name,
      resetPasswordLink
    })
    return SuccessMsgResponse(res, "Instruction has been sent to your mail")
  }),

  resetForgotPassword: asyncHandler(async (req, res) => {
    const { token, password, email } = req.body
    const user = await UserRepo.findForgotPasswordUser(token)

    if (user === null && email === user.email) throw BadRequestError("Invalid or expired token")

    req.user = user

    // Update user Password
    const forgotPassword = {
      requestedAt: null,
      token: null,
      expiresAt: null
    }
    await UserRepo.update({
      _id: user._id,
      password,
      forgotPassword
    })
    await KeystoreRepo.removeAll(user._id)
    // Mail should be triggered here (password hard reset successfully mail)
    resetPasswordMail(user.email, {
      _id: user._id,
      email: user.email,
      name: user.name,
      loginPath: frontEndLogin,
      password
    })
    return SuccessMsgResponse(res, "Password reset successfully")
  }),


  changePassword: asyncHandler(async (req, res) => {
    const { password, newPassword } = req.body
    const { user } = req
    // check old password is valid or not
    const match = await bcrypt.compare(password, user.password)
    if (!match) throw BadRequestError("Old password mismatched")
    // update password
    await UserRepo.update({
      _id: user._id,
      password: newPassword
    })
    // clear all keys
    await KeystoreRepo.removeAll(user._id)
    // create new Tokens
    const accessTokenKey = crypto.randomBytes(64).toString("hex")
    const refreshTokenKey = crypto.randomBytes(64).toString("hex")
    await KeystoreRepo.create(req.user._id, accessTokenKey, refreshTokenKey)
    const tokens = await assignTokens(req.user, accessTokenKey, refreshTokenKey)
    // Mail should be triggered here (password changed successfully mail)
    setPasswordMail(user.email, {
      _id: user._id,
      email: user.email,
      name: user.name,
      loginPath: frontEndLogin,
      password
    })
    return SuccessResponse(res, "Password has Changed", tokens)
  })

}
