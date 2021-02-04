const Joi = require("joi")
const { JoiObjectId } = require("../../../../lib/helper/validation")

module.exports = {
  acceptInvitation: Joi.object().keys({
    token: JoiObjectId().required(),
    password: Joi.string().required()
      .min(6)
      .max(12)
      .messages({
        "string.base": "password should be a type of 'text'",
        "string.empty": "password cannot be an empty field",
        "string.min": "password length must be at least {#limit} characters long",
        "string.max": "password length must be less than or equal to {#limit} characters long"
      })
  }),
  signupInvitation: Joi.object().keys({
    email: Joi.string().required().email(),
    phone: Joi.string().optional().allow(null, "")
      .min(6)
      .max(12)
      .messages({
        "string.base": "phone should be a type of 'text'",
        "string.empty": "phone cannot be an empty field",
        "string.min": "phone should have a minimum length of {#limit}",
        "string.max": "phone should have a maximum length of {#limit}"
      }),
    name: Joi.object().keys({
      first: Joi.string().required().messages({
        "string.base": "first name should be a type of 'text'",
        "string.empty": "first name cannot be an empty field",
        "any.required": "first name is not allowed to be empty"
      }),
      last: Joi.string().optional().allow(null, "")
        .messages({
          "string.base": "last name should be a type of 'text'"
        })
    })
  })
}
