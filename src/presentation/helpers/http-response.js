const { UnauthorizedError, ServerError } = require('../errors')

const HttpResponse = class HttpResponse {
  static ok (body) {
    return {
      statusCode: 200,
      body
    }
  }

  static badRequestError (error) {
    return {
      statusCode: 400,
      body: error
    }
  }

  static serverError () {
    return {
      statusCode: 500,
      body: new ServerError()
    }
  }

  static unauthorizedError () {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }
}

module.exports = HttpResponse
