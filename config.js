
const fs = require("fs")
const dotenv = require("dotenv")
// dotenv.config({ silent: process.env.NODE_ENV === 'production' });
dotenv.config()

const config = {}

//-----------------------------------------------------
//                                            C O R E
//-----------------------------------------------------
config.projectName = process.env.PROJECT_NAME || "Sankar_skeleton"
config.environment = process.env.NODE_ENV || "development"
config.port = process.env.PORT || "3000"

config.secret = process.env.SECRET || "nothing can be secret"
config.keys = {
  private: fs.readFileSync("./keys/private.pem"),
  public: fs.readFileSync("./keys/public.pem")
}
config.saltRound = Number(process.env.SALT_ROUNDS) || 10

//-----------------------------------------------------
//                                          T O K E N
//-----------------------------------------------------

config.tokenInfo = {
  accessTokenValidityDays: parseInt(process.env.ACCESS_TOKEN_VALIDITY_DAYS, 10),
  refreshTokenValidityDays: parseInt(process.env.REFRESH_TOKEN_VALIDITY_DAYS, 10),
  issuer: process.env.TOKEN_ISSUER,
  audience: process.env.TOKEN_AUDIENCE,
}

//-----------------------------------------------------
//                           A L L    D A T A B A S E
//-----------------------------------------------------

config.mongoCred = {
  name: process.env.MONGO_DB_NAME,
  connectionUri: process.env.MONGODB_CONNECTION_STRING
}

//-----------------------------------------------------
//                                              U R L
//-----------------------------------------------------
config.corsUrl = process.env.CORS_URL || "*"
config.siteUrl = process.env.SITE_URL || "http://localhost:3000"
config.frontEndLogin = process.env.FRONTEND_LOGIN_URL || "http://localhost:3000"

//-----------------------------------------------------
//                                  S M T P    M A I L
//-----------------------------------------------------
config.smtp = {
  sender: process.env.SMTP_FROM_ADDRESS,
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_AUTH_USER,
    pass: process.env.SMTP_AUTH_PASSWORD
  }
}

config.logDirectory = process.env.LOG_DIR
config.logPersistentDayCount = process.env.LOGGER_FILES_PERSISTENT_DAY_COUNT
// eslint-disable-next-line max-len
config.traceStackForAllError = Number(process.env.TRACE_STACK_FOR_ALL_TYPE_OF_ERROR)
// eslint-disable-next-line max-len
config.fileStoreMaxCount = Number(process.env.STORE_MAXIMUM_FILE_COUNT_OF_EACH_FEED_TYPE)
config.storeXmlFeedFile = Number(process.env.STORE_XML_FEED_FILE)
// eslint-disable-next-line max-len
config.storeXmlConvertedJsonFeedFile = Number(process.env.STORE_XML_CONVERTED_JSON_FEED_FILE)

module.exports = config
