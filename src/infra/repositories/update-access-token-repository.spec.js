const { MissingParamError } = require('../../utils/errors')

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (id, accessToken) {
    if (!id) {
      throw new MissingParamError('id')
    }
    if (!accessToken) {
      throw new MissingParamError('accessToken')
    }

    const updatedUser = await this.userModel.updateOne({
      _id: id
    }, {
      $set: {
        accessToken
      }
    })
    return updatedUser
  }
}

class UserModelSpy {
  async updateOne (query, data) {
    this.query = query
    this.data = data
    return this.updatedUser
  }
}

const makeSut = () => {
  const userModelSpy = new UserModelSpy()
  userModelSpy.updatedUser = {
    accessToken: 'accessToken'
  }
  const sut = new UpdateAccessTokenRepository(userModelSpy)
  return {
    sut,
    userModelSpy
  }
}

describe('UpdateAccessTokenRepository', () => {
  test('Should update the user with the given accessToken', async () => {
    const { sut, userModelSpy } = makeSut()
    userModelSpy.updatedUser = {
      accessToken: 'valid_accessToken'
    }
    const updatedUser = await sut.update('valid_user_id', 'valid_accessToken')
    expect(updatedUser.accessToken).toBe('valid_accessToken')
  })
  test('Should throw if no params are provided', async () => {
    const { sut } = makeSut()
    expect(sut.update()).rejects.toThrow(new MissingParamError('id'))
    expect(sut.update('id')).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
