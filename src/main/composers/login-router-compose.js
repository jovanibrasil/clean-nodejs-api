const LoginRouter = require('../../presentation/routers/login-router')
const AuthUseCase = require('../../domain/usecases/auth-usecase')
const EmailValidator = require('../../utils/helpers/email-validator')
const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const UpdateAccessTokenRepository = require('../../infra/repositories/update-access-token-repository')
const Encrypter = require('../../utils/helpers/encrypter')
const TokenGenerator = require('../../utils/helpers/token-generator')
const env = require('../config/env')
const MongoHelper = require('../../infra/helpers/mongo-helper')

module.exports = class LoginRouterComposer {
  static async compose () {
    const userModel = await MongoHelper.getCollection('users')

    const tokenGenerator = new TokenGenerator(env.tokenSecret)
    const encrypter = new Encrypter()
    const loadUserByEmailRepository = new LoadUserByEmailRepository(userModel)
    const updateAccessTokenRepository = new UpdateAccessTokenRepository(userModel)
    const emailValidator = new EmailValidator()
    const authUseCase = new AuthUseCase({
      loadUserByEmailRepository,
      updateAccessTokenRepository,
      encrypter,
      tokenGenerator
    })
    return new LoginRouter(
      authUseCase,
      emailValidator
    )
  }
}
