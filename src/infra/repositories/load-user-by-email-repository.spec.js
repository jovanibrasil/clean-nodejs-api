
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const { MissingParamError } = require('../../utils/errors')

class UserModel {
  async findOne ({ email }) {
    this.email = email
    return this.user
  }
}

const makeSut = () => {
  const userModel = new UserModel()
  userModel.user = null
  const sut = new LoadUserByEmailRepository(userModel)
  return { sut, userModel }
}

describe('LoadUserByEmail Repository', () => {
  test('Should return null if no user was found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid_email@mail.com')
    expect(user).toBeNull()
  })
  test('Should return an user if user was found', async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = {
      email: 'valid_email@mail.com',
      id: 1234,
      password: 'any_password'
    }
    userModel.user = fakeUser
    const user = await sut.load(fakeUser.email)
    expect(user).toEqual(fakeUser)
  })
  test('Should userModel receive the provided email', async () => {
    const { sut, userModel } = makeSut()
    await sut.load('valid_email@mail.com')
    expect(userModel.email).toEqual('valid_email@mail.com')
  })
  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
