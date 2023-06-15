import { MissingParamError } from '../errors/missingParamError'
import { badRequest } from '../helpers/httpHelper'
import type { Controller } from '../protocols/controller'
import type { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    return {
      statusCode: 0,
      body: ''
    }
  }
}
