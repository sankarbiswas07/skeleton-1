// import
const express = require("express")
const signup = require("./signup")
const login = require("./login")
const getTokens = require("./getTokens")
const logout = require("./logout")
const refreshToken = require("./refreshToken")
const { issueForgetPassword, resetForgotPassword, changePassword } = require("./password")
// const schema = require("../../../../lib/auth/schema")
const schema = require("./schema")
const { validator, ValidationSource } = require("../../../../lib/helper/validation")

//----------------------------------------------------
//  A U T H E N T I C A T E D    M I D D L E W A R E
//----------------------------------------------------
const authenticated = require("../../../../lib/auth/authentication")

//----------------------------------------------------
//                                M I D D L E W A R E
//----------------------------------------------------
const hasAuthSchema = validator(schema.auth, ValidationSource.HEADER)
const hasRefreshSchema = validator(schema.refreshToken)
const hasSignupSchema = validator(schema.signup)
const hasLoginSchema = validator(schema.userCredential)
const hasTokenIssueSchema = validator(
  schema.issueToken, ValidationSource.HEADER
)
const hasForgetPasswordSchema = validator(schema.forgetPassword)
const resetPasswordSchema = validator(schema.resetPassword)

//----------------------------------------------------
//                                      R O U T E S
//----------------------------------------------------
const router = express.Router()

// Test Route is reachable or not
router.get("/", (req, res) => res.status(200).json({ error: false, message: "Unauthorized API(s) are accessible : x-api-key accepted" }))


//-------------------------------------------------------
//                              Unauthenticated Routes
//-------------------------------------------------------
router.post("/signup", hasSignupSchema, signup)
router.post("/login", hasLoginSchema, login)
router.post("/getTokens", hasTokenIssueSchema, getTokens)
router.post("/refresh", hasAuthSchema, hasRefreshSchema, refreshToken)
router.post("/forgetPassword", hasForgetPasswordSchema, issueForgetPassword) // request to get change password link in email
router.post("/resetPassword", resetPasswordSchema, resetForgotPassword) // force reset password without password > forget password link

//-------------------------------------------------------------------------
//                                                  Authenticated routes
router.use(authenticated)
//-------------------------------------------------------------------------

router.post("/logout/:fromAllDevices?", logout) // Logout requested device or logout from all devices
router.post("/changePassword", changePassword) // Authenticated user to change password

// const auth = router
module.exports = router
