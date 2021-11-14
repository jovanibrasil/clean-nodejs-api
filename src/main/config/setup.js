const cors = require('../middlewares/cors')
const contentType = require('../middlewares/content-type')
const jsonParser = require('../middlewares/jason-parser')

module.exports = {
  setupApp: app => {
    app.disable('x-powered-by')
    app.use(contentType)
    app.use(jsonParser)
    app.use(cors)
  }
}
