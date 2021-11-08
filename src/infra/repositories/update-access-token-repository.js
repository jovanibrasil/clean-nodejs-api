const { MissingParamError } = require('../../utils/errors')

module.exports = class UpdateAccessTokenRepository {
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
