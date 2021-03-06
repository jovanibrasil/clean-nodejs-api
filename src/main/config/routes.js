const router = require('express').Router()
const loginRoutes = require('../routes/login-routes')

module.exports = app => {
  app.use('/api', router)
  loginRoutes(router)
}
