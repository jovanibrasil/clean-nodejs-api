const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeSut = () => {
  class TokenGeneratorSpy {
    async generate (id) {
      this.id = id
      return this.accessToken
    }
  }

  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }

  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    id: '123',
    password: 'hashed_password'
  }
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true

  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'accessToken'

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  })

  return {
    sut,
    encrypterSpy,
    tokenGeneratorSpy,
    loadUserByEmailRepositorySpy
  }
}

describe('Auth use case', () => {
  test('Should throw error if no email is provided', async () => {
    const { sut } = makeSut()
    const promisse = sut.auth()
    expect(promisse).rejects.toThrow(new MissingParamError('email'))
  })
  test('Should throw error if no password is provided', async () => {
    const { sut } = makeSut()
    const promisse = sut.auth('email@mail.com')
    expect(promisse).rejects.toThrow(new MissingParamError('password'))
  })
  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('any_email@mail.com', 'any_password')
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@mail.com')
  })
  test('Should thrown if no repository is provided', async () => {
    const sut = new AuthUseCase({})
    const promisse = sut.auth('any_email@mail.com', 'any_password')
    expect(promisse).rejects.toThrow()
  })
  test('Should thrown if no repository is provided without load method', async () => {
    const sut = new AuthUseCase({ loadUserByEmailRepository: {} })
    const promisse = sut.auth('any_email@mail.com', 'any_password')
    expect(promisse).rejects.toThrow()
  })
  test('Should return null if email was provided but no user was found', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const token = await sut.auth('invalid_email@mail.com', 'any_password')
    expect(token).toBeNull()
  })
  test('Should return null if email an invalid password was provided', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const token = await sut.auth('valid_email@mail.com', 'invalid_password')
    expect(token).toBeNull()
  })
  test('should call encrypter with correct values', async () => {
    const { sut, encrypterSpy, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'any_password')
    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })
  test('should call tokenGenerator with correct id', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'valid_password')
    expect(tokenGeneratorSpy.id).toBe(loadUserByEmailRepositorySpy.user.id)
  })
  test('should call tokenGenerator with valid credentials', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const accessToken = await sut.auth('valid_email@mail.com', 'valid_password')
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
  })
})
