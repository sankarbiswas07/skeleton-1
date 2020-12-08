const express = require("express")
const router = express.Router()

// const expressJwt = require("express-jwt")

// const checkJwt = expressJwt({ secret: process.env.SECRET }) // the JWT auth check middleware

/**
 *
 *  All unauthenticated routes will be handled here
 *
 */


// router.all("*", checkJwt) // Auth Middleware

/**
 *
 *  All authenticated routes will be handled here
 *
 */

module.exports = router
