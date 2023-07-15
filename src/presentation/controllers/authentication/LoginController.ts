import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http'
import type { Authentication } from '@/domain/useCases/account/Authentication'
import type { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'

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
