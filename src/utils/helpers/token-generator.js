const jwt = require('jsonwebtoken')
const MissingParamError = require('../errors/missing-param-error')

module.exports = class TokenGenerator {
  constructor (secret) {
    this.secret = secret
  }

  async generate (value) {
    if (!value) {
      throw new MissingParamError('value')
    }

    return jwt.sign(value, this.secret)
  }
}
