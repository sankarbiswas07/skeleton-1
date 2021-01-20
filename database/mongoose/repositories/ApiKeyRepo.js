const ApiKey = require("../models/apiKey")

const ApiRepo = {
  findByKey: async key => ApiKey.findOne({ key, status: true }).lean().exec()
}

module.exports = ApiRepo
