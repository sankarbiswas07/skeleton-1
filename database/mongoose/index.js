const mongoose = require("mongoose")
const logger = require("../../lib/core/logger")

module.exports = {

  mongo: (mongoCred) => {
    const dbURI = `${mongoCred.connectionUri}`

    logger.debug(dbURI)

    // Create the database connection
    mongoose.connect(dbURI)
      .then(() => { logger.info("Mongoose connection done") })
      .catch((e) => {
        logger.info("Mongoose connection error")
        logger.error(e)
      })

    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on("connected", () => {
      logger.info(`Mongoose default connection open to ${dbURI}`)
    })

    // If the connection throws an error
    mongoose.connection.on("error", (err) => {
      logger.error(`Mongoose default connection error: ${err}`)
    })

    // When the connection is disconnected
    mongoose.connection.on("disconnected", () => {
      logger.info("Mongoose default connection disconnected")
    })
  }
}
