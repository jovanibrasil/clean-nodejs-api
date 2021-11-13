const { MongoClient } = require('mongodb')

module.exports = {
  async connect (uri) {
    await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }
}
