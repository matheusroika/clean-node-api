import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/httpHelper'
import type { Controller, HttpRequest, HttpResponse } from '../../protocols'
import type { Authentication } from '../../../domain/usecases/authentication'
import type { EmailValidator } from '../signup/signupProtocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const token = await this.authentication.auth(email, password)
      return {
        statusCode: 200,
        body: {
          token
        }
      }
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
