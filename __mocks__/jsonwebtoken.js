module.exports = {
  token: 'access_token',

  sign (value, secret) {
    this.value = value
    this.secret = secret
    return this.token
  }
}
