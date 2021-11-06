const bcrypt = require('bcrypt')
const MissingParamError = require('./errors/missing-param-error')
const Encrypter = require('./encrypter')

const makeSut = () => {
  const sut = new Encrypter()
  return { sut }
}

describe('Encrypter', () => {
  test('Should return true if encrypter bcrypt returns true', async () => {
    const { sut } = makeSut()
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(true)
  })
  test('Should return false if encrypter bcrypt returns false', async () => {
    const { sut } = makeSut()
    bcrypt.isValid = false
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(false)
  })
  test('Should call bcrypt with correct values', async () => {
    const { sut } = makeSut()
    await sut.compare('any_value', 'any_hash')
    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hash).toBe('any_hash')
  })
  test('shoud throw if no param are provided', async () => {
    const { sut } = makeSut()
    expect(sut.compare()).rejects.toThrow(new MissingParamError('value'))
    expect(sut.compare('value')).rejects.toThrow(new MissingParamError('hash'))
  })
})
