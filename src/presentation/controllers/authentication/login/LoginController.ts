import { badRequest, ok, serverError, unauthorized } from './LoginControllerProtocols'
import type { Controller, HttpRequest, HttpResponse, Authentication, Validation } from './LoginControllerProtocols'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { email, password } = httpRequest.body
      const authAccount = await this.authentication.auth({ email, password })
      if (!authAccount) {
        return unauthorized()
      }

      return ok(authAccount)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
