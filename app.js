const helmet = require("helmet")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const morgan = require("morgan")
const path = require("path")
const logger = require("./lib/core/logger")
const { corsUrl, environment, traceStackForAllError } = require("./config")

require("./database") // initialize database
const { NotFoundError, ApiError, InternalError } = require("./lib/core/apiError")
const router = require("./routes/rest/v1")

// important here "__dirname is only defined in scripts. It's not available in REPL"
// const __dirname = path.resolve()
// logger.debug(__dirname)

// Uncaught Exception Error
process.on("uncaughtException", (e) => {
  logger.error(e)
})

const app = express()

if (environment !== undefined && environment !== "development") {
  app.use(helmet())
}
// Response send Logger Middleware setup, It will just console not saved in logs
// later will modify somehow to track all response time route-wise so can analyse the server api min speed
app.use(morgan("dev"))

// Body Parser setup
app.use(bodyParser.json({ limit: "10mb" }))
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }))

// Access Control Allow Origin setup
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }))

// View Engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

// Public Folder setup
app.use(express.static(path.join(__dirname, "public")))

// Routes
app.use("/v1", router)

// Send Path not found error
app.use((req, res, next) => {
  next(NotFoundError())
})

// Middleware Error Handler
// log each every error but take the stack if it's an Internal error
// otherwise clear the error stack
// eslint-disable-next-line no-unused-vars, consistent-return
app.use((err, req, res, next) => {
  // for safe side extra try-catch block
  try {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get("env") === "development" ? err : {}

    // All intentional error handler including Internal Error
    if (ApiError.hasSupport(err.type)) {
      if (!traceStackForAllError) {
        // eslint-disable-next-line no-param-reassign
        err.stack = "Error: Stack is cleared\n    at app.js:91"
      }
      logger.error(err)
      return ApiError.handle(err, res)
    }

    // if (environment === "development") {
    //   logger.error(err)
    //   return res.status(500).send(err.message)
    // }

    // though asyncHandler it can be an error without any type, force an InternalError then
    logger.error(err)
    ApiError.handle(InternalError(err.message), res)
  } catch (error) {
    // catch here means something went really wrong, do a special action here
    // as this try catch is not required here
    logger.error(error)
    ApiError.handle(error, res)
  }
})


module.exports = app
