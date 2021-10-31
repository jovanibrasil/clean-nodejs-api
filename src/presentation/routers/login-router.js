const HttpResponse = require('../helpers/http-response')
const InvalidParamError = require('../helpers/invalid-param-error')
const MissingParamError = require('../helpers/missing-param-error')

const LoginRouter = class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResponse.badRequestError(new MissingParamError('email'))
      }
      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequestError(new InvalidParamError('email'))
      }
      if (!password) {
        return HttpResponse.badRequestError(new MissingParamError('password'))
      }

      const accessToken = await this.authUseCase.auth(email, password)

      if (!accessToken) {
        return HttpResponse.unauthorizedError()
      }

      return HttpResponse.ok({ accessToken })
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}

module.exports = LoginRouter
