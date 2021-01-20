const { environment } = require("../../config")
const {
  NotFoundResponse,
  InternalErrorResponse,
  BadRequestResponse,
  ForbiddenResponse,
  AuthFailureResponse,
  AccessTokenErrorResponse,
} = require("./apiResponse")
//----------------------------------------
//                      P R O T E C T E D
//----------------------------------------
const ErrorType = {
  BAD_TOKEN: "BadTokenError",
  TOKEN_EXPIRED: "TokenExpiredError",
  UNAUTHORIZED: "AuthFailureError",
  ACCESS_TOKEN: "AccessTokenError",
  INTERNAL: "InternalError",
  NOT_FOUND: "NotFoundError",
  NO_ENTRY: "NoEntryError",
  NO_DATA: "NoDataError",
  BAD_REQUEST: "BadRequestError",
  FORBIDDEN: "ForbiddenError"
}

// _wrap: will wrap the err object with custom type & message
const _wrap = (type, message = "caught error") => {
  const error = Error(message)
  error.type = type
  return error
}

const _case = (err, res) => {
  switch (err.type) {
    case ErrorType.BAD_TOKEN:
    case ErrorType.TOKEN_EXPIRED:
    case ErrorType.UNAUTHORIZED:
      return AuthFailureResponse(res, err.message)
    case ErrorType.ACCESS_TOKEN:
      return AccessTokenErrorResponse(res, err.message)
    case ErrorType.INTERNAL:
      return InternalErrorResponse(res, err.message)
    case ErrorType.NOT_FOUND:
    case ErrorType.NO_ENTRY:
    case ErrorType.NO_DATA:
      return NotFoundResponse(res, err.message)
    case ErrorType.BAD_REQUEST:
      return BadRequestResponse(res, err.message)
    case ErrorType.FORBIDDEN:
      return ForbiddenResponse(res, err.message)

    default: {
      let { message } = err
      // Do not send failure message in production as it may send sensitive data
      if (environment !== "development") message = "Something wrong happened."
      return InternalErrorResponse(res, message)
    }
  }
}

module.exports = {
  ApiError: {
  // handle: A dedicated transporter of Error response
    handle: _case,
    // hasSupport: a array list of handled error, use to check the incoming error is intentionally triggered or not
    hasSupport: it => !!Object.values(ErrorType).includes(it)
  },

  ForbiddenError: message => _wrap(ErrorType.FORBIDDEN, message || "Permission denied"),

  NotFoundError: message => _wrap(ErrorType.NOT_FOUND, message || "Not Found"),

  InternalError: (message, err) => _wrap(ErrorType.INTERNAL, message || "Internal Error", err),

  AuthFailureError: message => _wrap(ErrorType.UNAUTHORIZED, message || "Invalid Credentials"),

  BadRequestError: message => _wrap(ErrorType.BAD_REQUEST, message || "Bad Request"),

  NoEntryError: message => _wrap(ErrorType.NO_ENTRY, message || "Entry don't exists"),

  BadTokenError: message => _wrap(ErrorType.BAD_TOKEN, message || "Token is not valid"),

  TokenExpiredError: message => _wrap(ErrorType.TOKEN_EXPIRED, message || "Token is expired"),

  NoDataError: message => _wrap(ErrorType.NO_DATA, message || "No data available"),

  AccessTokenError: message => _wrap(ErrorType.ACCESS_TOKEN, message || "Invalid access token"),
}
