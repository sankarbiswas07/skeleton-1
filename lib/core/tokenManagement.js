const jwt = require("jsonwebtoken")
const { keys, tokenInfo } = require("../../config")
const logger = require("./logger")
const { InternalError, TokenExpiredError, BadTokenError } = require("./apiError")
const {
  accessTokenValidityDays, refreshTokenValidityDays,
  issuer, audience
} = tokenInfo

/*
 * issuer - Software organization who issues the token.
 * audience - Basically identity of the intended recipient of the token.
 * issueAt- Token issued time.
 * subject - Intended user of the token.
 * expiresIn - Expiration time after which the token will be invalid.
 * params - Custom field that I have added to identify the token for the user so that we can force invalidate that token when needed.
 *
 */

const _jwtPayload = (subject, param, validity) => {
  const iat = Math.floor(Date.now() / 1000)
  return {
    iss: issuer,
    aud: audience,
    iat,
    sub: subject,
    exp: iat + (validity * 24 * 60 * 60),
    prm: param
  }
}


module.exports = {

  // Token assignment
  async assignTokens(data, primaryKey, secondaryKey) {
    const accessToken = jwt.sign(_jwtPayload(data._id, primaryKey, accessTokenValidityDays), keys.private, { algorithm: "RS256" })
    if (!accessToken) throw InternalError()
    const refreshToken = jwt.sign(_jwtPayload(data._id, secondaryKey, refreshTokenValidityDays), keys.private, { algorithm: "RS256" })
    if (!refreshToken) throw InternalError()
    return {
      tokens: {
        accessToken,
        refreshToken
      }
    }
  },

  // Verify Token
  /**
 * This method checks the token and returns the decoded data
 * when token is valid in all respect
 */
  async verifyToken(token, validations) {
    try {
      return await jwt.verify(token, keys.public, validations)
    } catch (e) {
      logger.debug(e)
      if (e && e.name === "TokenExpiredError") throw TokenExpiredError()
      throw BadTokenError()
    }
  },

  /**
   * Decode Token. expected eg: 'xx.xxx.xx'
   * This method checks the token and returns the decoded data
   * even when the token is expired
  */
  async decodeToken(token, validations) {
    try {
      // token is verified if it was encrypted by the private key
      // and if is still not expired then get the payload
      return await jwt.verify(token, keys.public, validations)
    } catch (e) {
      logger.debug(e)
      if (e && e.name === "TokenExpiredError") {
        // if the token has expired but was encrypted by the private key
        // then decode it to get the payload
        return this.decodeToken(token)
      }
      // throws error if the token has not been encrypted by the private key
      // or has not been issued for the user
      throw BadTokenError()
    }
  },


  // Validate Token Data
  async validateTokenData(userId, payload) {
    if (!payload || !payload.iss || !payload.sub || !payload.prm
      || payload.iss !== tokenInfo.issuer
      || payload.aud !== tokenInfo.audience
      || payload.sub !== userId.toHexString()) throw new Error("Invalid Access Token")
    return payload
  }

}
