const LoginRouter = require('./login-router')
const { MissingParamError, InvalidParamError, UnauthorizedError, ServerError } = require('../errors')

class AuthUseCaseSpy {
  async auth (email, password) {
    this.email = email
    this.password = password
    return this.accessToken
  }
}

class EmailValidatorSpy {
  isValid (email) {
    this.email = email
    return this.isEmailValid
  }
}

const makeSut = () => {
  const authUseCaseSpy = new AuthUseCaseSpy()
  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)
  return {
    authUseCaseSpy,
    emailValidatorSpy,
    sut
  }
}

describe('Login router', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  test('Should return 400 if invalid email format is provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password',
        email: 'invalid_email@email.com'
      }
    }
    emailValidatorSpy.isEmailValid = false
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  test('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should return 500 if no httpRequest does not have a body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should call AuthUseCase with correct params', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password',
        email: 'any_email@email.com'
      }
    }
    sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })
  test('Should return 500 if no AuthCase is provided', async () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'any_password',
        email: 'any_email@email.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should return 500 if the AuthCase does not have an auth method', async () => {
    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        password: 'any_password',
        email: 'any_email@email.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should return 401 when invalid credential are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        password: 'invalid_password',
        email: 'invalid_email@email.com'
      }
    }
    authUseCaseSpy.accessToken = ''
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })
  test('Should return 200 when dependencies are provided and credentials are valid', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = 'valid_token'
    const httpRequest = {
      body: {
        password: 'valid_password',
        email: 'valid_email@email.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })
})
