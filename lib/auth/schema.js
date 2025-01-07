const Joi = require("joi")
const { JoiObjectId } = require("../helper/validation")

module.exports = {
  apiKey: Joi.object().keys({
    "x-api-key": Joi.string().required()
  }).unknown(true),

  userCredential: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),

  refreshToken: Joi.object().keys({
    refreshToken: Joi.string().required().min(1),
  }),

  auth: Joi.object().keys({
    "authorization": Joi.string().required(),
    "x-user-id": JoiObjectId().required(),
  }).unknown(true)
}
