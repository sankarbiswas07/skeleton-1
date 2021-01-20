const fs = require("fs")
const path = require("path")
const winston = require("winston")
const DailyRotateFile = require("winston-daily-rotate-file")
const { environment, logDirectory, logPersistentDayCount } = require("../../config")

let dir = logDirectory
if (!dir) dir = path.resolve("logs")

// create directory if it is not present
if (!fs.existsSync(dir)) {
  // Create the directory if it does not exist
  fs.mkdirSync(dir)
}

// Hide all debug level log in production except `warn`
const logLevel = environment === "development" ? "debug" : "warn"

// Custom print function
const printMe = winston.format.printf(info => `${Object.keys(info).reverse().reduce((acc, key, i) => {
  if (typeof key === "string") {
    const _info = typeof info[key] === "object" ? JSON.stringify(info[key]) : info[key]
    // eslint-disable-next-line no-param-reassign
    if (i > 0) acc += ",\n"
    // eslint-disable-next-line no-param-reassign
    acc += `  "${key}": "${_info}"`
  }
  return acc
}, "{\n")}\n}`)

// Options : basic config to separate console & file write style
const options = {
  console: {
    level: logLevel,
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
      printMe
    )
  },
  file: {
    // Only error level logs are allowed to write
    level: "error",
    filename: `${dir}/%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    timestamp: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    prettyPrint: true,
    json: true,
    maxSize: "20m",
    colorize: true,
    maxFiles: `${logPersistentDayCount}d`,
    format: winston.format.combine(
      // stringified log JSON structure as color is not need while writing in file
      // winston.format.prettyPrint(),
      winston.format.json()
    )
  }
}

// Export Default logger
module.exports = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    // to track error stack, this line has be here, not in any other level
    // could be better if it can pass through any option above
    winston.format.errors({ stack: true })
  ),
  transports: [
    new winston.transports.Console(options.console),
    new DailyRotateFile(options.file)
  ],
  exceptionHandlers: [
    new DailyRotateFile(options.file),
  ],
  exitOnError: false // do not exit on handled exceptions
})
