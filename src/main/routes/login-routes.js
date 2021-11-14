const LoginRouterCompose = require('../composers/login-router-compose')
const ExpressRouterAdapt = require('../adapters/express-router-adapter')

module.exports = (router) => {
  router.post('/login', async (req, res) => {
    const loginRouter = await LoginRouterCompose.compose()
    const expressRouter = ExpressRouterAdapt.adapt(loginRouter)
    expressRouter(req, res)
  })
}
