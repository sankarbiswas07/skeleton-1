const express = require("express")
const asyncHandler = require("../core/asyncHandler")
const { validator, ValidationSource } = require("../helper/validation")
const schema = require("./schema")

const router = express.Router()

module.exports = router.use(validator(schema.apiKey, ValidationSource.HEADER),
  asyncHandler(async (req, res, next) => {
    let accessToken = null // set default
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      accessToken = req.headers.authorization
        .slice(7, req.headers.authorization.length)
        .trimLeft()
      req.headers.authorization = accessToken // reset authorization header, removed Bearer
    } else {
      req.header.authorization = null
    }
    return next()
  }))
