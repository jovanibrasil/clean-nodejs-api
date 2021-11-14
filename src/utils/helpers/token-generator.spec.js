jest.mock('jsonwebtoken', () => ({
  token: 'access_token',

  sign (value, secret) {
    this.value = value
    this.secret = secret
    return this.token
  }
}))

const jwt = require('jsonwebtoken')
const MissingParamError = require('../errors/missing-param-error')
const TokenGenerator = require('./token-generator')

const makeSut = () => {
  const sut = new TokenGenerator('secret')
  return {
    sut
  }
}

describe('Token generator', () => {
  test('Should return null if jwt returns null', async () => {
    const { sut } = makeSut()
    jwt.token = null
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })
  test('Should return a token if jwt returns a token', async () => {
    const { sut } = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBe(jwt.token)
  })
  test('Should call jwt with correct values', async () => {
    const { sut } = makeSut()
    await sut.generate('any_id')
    expect(jwt.value).toEqual({
      _id: 'any_id'
    })
    expect(jwt.secret).toBe('secret')
  })
  test('Should throw error if no params are provided', async () => {
    const { sut } = makeSut()
    expect(sut.generate()).rejects.toThrow(new MissingParamError('value'))
  })
})
