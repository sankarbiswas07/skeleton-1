//--------------------------------------
//                   P R O T E C T E D
//--------------------------------------
const StatusCode = {
  SUCCESS: "10000",
  FAILURE: "10001",
  RETRY: "10002",
  INVALID_ACCESS_TOKEN: "10003"
}

const ResponseStatus = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
}

const __prepare = (res, status, data) => res.status(status).json(data)

const _send = (res, code, status, message, data) => __prepare(res, status, {
  statusCode: code,
  message,
  data
})

module.exports = {
  //----------------------------------------
  // A P I   S U C C E S S  R E S P O N S E
  //----------------------------------------
  SuccessMsgResponse: (res, message) => {
    const { SUCCESS: code } = StatusCode
    const { SUCCESS: status } = ResponseStatus
    // data is undefined here as it's just a message
    return _send(res, code, status, message)
  },

  FailureMsgResponse: (res, message) => {
    const { FAILURE: code } = StatusCode
    const { SUCCESS: status } = ResponseStatus
    // data is undefined here as it's just a message
    return _send(res, code, status, message)
  },

  SuccessResponse: (res, message, data) => {
    const { SUCCESS: code } = StatusCode
    const { SUCCESS: status } = ResponseStatus
    return _send(res, code, status, message, data)
  },

  TokenRefreshResponse: (res, message, data) => {
    const { SUCCESS: code } = StatusCode
    const { SUCCESS: status } = ResponseStatus
    return _send(res, code, status, message, data)
  },

  // In case of an api error, we should _send it as a response,
  // so Api error is a part of api response too.
  //----------------------------------------
  //    A P I   E R R O R   R E S P O N S E
  //----------------------------------------
  NotFoundResponse: (res, message, data) => {
    const { FAILURE: code } = StatusCode
    const { NOT_FOUND: status } = ResponseStatus
    return _send(res, code, status, message, data)
  },

  InternalErrorResponse: (res, message, data) => {
    const { FAILURE: code } = StatusCode
    const { INTERNAL_ERROR: status } = ResponseStatus
    return _send(res, code, status, message, data)
  },

  BadRequestResponse: (res, message, data) => {
    const { FAILURE: code } = StatusCode
    const { BAD_REQUEST: status } = ResponseStatus
    return _send(res, code, status, message, data)
  },

  ForbiddenResponse: (res, message, data) => {
    const { FAILURE: code } = StatusCode
    const { FORBIDDEN: status } = ResponseStatus
    return _send(res, code, status, message, data)
  },

  AuthFailureResponse: (res, message, data) => {
    const { FAILURE: code } = StatusCode
    const { UNAUTHORIZED: status } = ResponseStatus
    return _send(res, code, status, message, data)
  },

  AccessTokenErrorResponse: (res, message, data) => {
    const { INVALID_ACCESS_TOKEN: code } = StatusCode
    const { UNAUTHORIZED: status } = ResponseStatus
    return _send(res, code, status, message, data)
  },
}
