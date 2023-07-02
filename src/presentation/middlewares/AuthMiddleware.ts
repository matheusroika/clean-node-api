import { AccessDeniedError, forbidden, ok, serverError } from './AuthMiddlewareProtocols'
import type { HttpRequest, HttpResponse, LoadAccountByToken, Middleware } from './AuthMiddlewareProtocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (!accessToken) return forbidden(new AccessDeniedError())

      const account = await this.loadAccountByToken.load(accessToken)
      if (!account) return forbidden(new AccessDeniedError())

      return ok({ accountId: account.id })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
