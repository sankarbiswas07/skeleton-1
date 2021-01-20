// import
const express = require("express")
const signup = require("./signup")
const login = require("./login")
const refreshToken = require("./refreshToken")
const schema = require("../../../../lib/auth/schema")
const { validator, ValidationSource } = require("../../../../lib/helper/validation")

//----------------------------------------------------
//                                M I D D L E W A R E
//----------------------------------------------------
const hasAuthSchema = validator(schema.auth, ValidationSource.HEADER)
const hasRefreshSchema = validator(schema.refreshToken)

//----------------------------------------------------
//                                      R O U T E S
//----------------------------------------------------
const router = express.Router()

// route set controllers
router.post("/signup", signup)
router.post("/login", login)
router.post("/refresh", hasAuthSchema, hasRefreshSchema, refreshToken)
// router.get("/", (req, res) => res.status(200).json({ error: false, message: "Unauthorized API(s) are accessible : x-api-key accepted" }))

// const auth = router
module.exports = router
