import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http'
import type { Authentication } from '@/domain/useCases/account/Authentication'
import type { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export type LoginControllerRequest = {
  email: string
  password: string
}

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (request: LoginControllerRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }

      const { email, password } = request
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
