const Joi = require("joi")
const mongoose = require("mongoose")
const logger = require("../core/logger")
const { BadRequestError } = require("../core/apiError")

const ValidationSource = {
  BODY: "body",
  HEADER: "headers",
  QUERY: "query",
  PARAM: "params"
}

module.exports = {
  ValidationSource,

  JoiObjectId: () => Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) return helpers.error("any.invalid")
    return value
  }, "Object Id Validation"),

  // eslint-disable-next-line consistent-return
  validator: (schema, source = ValidationSource.BODY) => (req, res, next) => {
    try {
      const { error } = schema.validate(req[source])

      if (!error) return next()

      const { details } = error
      const message = details.map(i => i.message.replace(/['"]+/g, "")).join(",")
      // logger.error(message)

      next(BadRequestError(message))
    } catch (error) {
      next(error)
    }
  }
}
