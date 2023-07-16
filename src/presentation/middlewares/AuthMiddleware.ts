import { forbidden, ok, serverError } from '@/presentation/helpers/http'
import { AccessDeniedError } from '@/presentation/errors'
import type { LoadAccountByToken } from '@/domain/useCases/account/LoadAccountByToken'
import type { HttpResponse, Middleware } from '@/presentation/protocols'

export type AuthMiddlewareRequest = {
  accessToken?: string
}

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (request: AuthMiddlewareRequest): Promise<HttpResponse> {
    try {
      const { accessToken } = request
      if (!accessToken) return forbidden(new AccessDeniedError())

      const account = await this.loadAccountByToken.load(accessToken, this.role)
      if (!account) return forbidden(new AccessDeniedError())

      return ok({ accountId: account.id.toString() })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
