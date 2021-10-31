const express = require('express')
const router = express.Router()

module.exports = () => {
  const signUpRouter = new SignUpRouter()
  router.post('/signup', ExpressRouterAdapter.Adapt(signUpRouter))
}

class ExpressRouterAdapter {
  static Adapt (router) {
    return async (req, res) => {
      const httpRequest = {
        body: req.body
      }
      const httpResponse = await router.route(httpRequest)
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}

// presentation
class SignUpRouter {
  async route (httpRequest) {
    const { email, password, repeatPassword } = httpRequest.body
    const user = new SignUpUseCase().signUp(email, password, repeatPassword)
    if (user) {
      return {
        statusCode: 200,
        user
      }
    }
    return {
      statusCode: 400,
      error: 'password must be equal to repeat password'
    }
  }
}

// domain
class SignUpUseCase {
  async signUp (email, password, repeatPassword) {
    if (password === repeatPassword) {
      return new AddAccountRepository().add(email, password)
    }
  }
}

// infra
// const mongoose = require('mongoose')
// const AccountModel = mongoose.model('Account');
class AddAccountRepository {
  async add (email, password) {
    // const user = AccountModel.create({ email, password })
    // return res.json(user)
    return { email }
  }
}
