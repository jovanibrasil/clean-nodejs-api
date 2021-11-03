const EmailValidator = require('./email-validator')
const validator = require('validator')

const makeSut = () => {
  return new EmailValidator()
}

describe('Email validator', () => {
  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isEmail = sut.isValid('valid_email@mail.com')
    expect(isEmail).toBe(true)
  })
  test('Should return false if validator returns false', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isEmail = sut.isValid('valid_emailmail.com')
    expect(isEmail).toBe(false)
  })
  test('Should call validator with correct email', () => {
    const email = 'valid_email@mail.com'
    makeSut().isValid(email)
    expect(validator.email).toBe(email)
  })
})
