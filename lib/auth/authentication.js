const express = require("express")
const mongoose = require("mongoose")
const { tokenInfo } = require("../../config")
const logger = require("../core/logger")
const asyncHandler = require("../core/asyncHandler")
const { AuthFailureError, AccessTokenError, TokenExpiredError } = require("../core/apiError")
const UserRepo = require("../../database/mongoose/repositories/UserRepo")
const KeystoreRepo = require("../../database/mongoose/repositories/KeystoreRepo")
const { validator, ValidationSource } = require("../helper/validation")
const { verifyToken, validateTokenData } = require("../core/tokenManagement")
const schema = require("./schema")
const router = express.Router()

module.exports = router.use(validator(schema.auth, ValidationSource.HEADER),
  asyncHandler(async (req, res, next) => {
    req.accessToken = req.headers["x-access-token"]
    const user = await UserRepo.findById(mongoose.Types.ObjectId(req.headers["x-user-id"].toString()))
    if (!user) throw AuthFailureError("User not registered")
    req.user = user

    try {
      // JWT token meta validation option
      const option = {
        iss: tokenInfo.issuer,
        aud: tokenInfo.audience,
        sub: req.user._id.toHexString()
      }
      const accessTokenPayload = await validateTokenData(
        req.user._id,
        await verifyToken(req.accessToken, option)
      )

      const jwtPayload = await validateTokenData(
        req.user._id,
        accessTokenPayload
      )
      const keystore = await KeystoreRepo
        .findForKey(req.user._id, accessTokenPayload.prm)

      if (!keystore || keystore.primaryKey !== jwtPayload.prm) throw AuthFailureError("Invalid access token")

      req.keystore = keystore

      return next()
    } catch (e) {
      if (e.type === "TokenExpiredError") throw AccessTokenError(e.message)
      throw e // stay safe
    }
  }))
