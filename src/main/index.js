const mongoHelper = require('../infra/helpers/mongo-helper')
const env = require('./config/env')
const app = require('./config/app')

mongoHelper.connect(env.mongoUrl)
  .then(() => {
    app.listen(env.port, () => {})
  })
  .catch(console.error)
