const express = require("express")
const logger = require("../core/logger")
const asyncHandler = require("../core/asyncHandler")
const { ForbiddenError } = require("../core/apiError")
const ApiKeyRepo = require("../../database/mongoose/repositories/ApiKeyRepo")
const { validator, ValidationSource } = require("../helper/validation")
const schema = require("./schema")
const router = express.Router()

module.exports = router.use(
  validator(schema.apiKey, ValidationSource.HEADER),
  asyncHandler(async (req, res, next) => {
    req.apiKey = req.headers["x-api-key"].toString()
    logger.debug(`req.apiKey = ${req.apiKey}`)
    const apiKey = await ApiKeyRepo.findByKey(req.apiKey)
    // logger.info(apiKey)

    if (!apiKey) throw ForbiddenError()
    return next()
  }))
