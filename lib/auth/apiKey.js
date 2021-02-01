const express = require("express")
const logger = require("../core/logger")
const asyncHandler = require("../core/asyncHandler")
const { ForbiddenError } = require("../core/apiError")
const ApiKeyRepo = require("../../database/mongoose/repositories/ApiKeyRepo")
const { validator, ValidationSource } = require("../helper/validation")
const schema = require("./schema")
const router = express.Router()

module.exports = router.use(validator(schema.apiKey, ValidationSource.HEADER),
  asyncHandler(async (req, res, next) => {
    const clientId = req.headers["x-api-key"].toString()
    logger.debug(`req.apiKey = ${clientId}`)
    const client = await ApiKeyRepo.findByKey(clientId)
    // logger.info(apiKey)

    // either null or client object
    if (!client) throw ForbiddenError()
    req.client = client
    return next()
  }))
