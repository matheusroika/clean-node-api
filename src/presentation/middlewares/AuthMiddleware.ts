import type { HttpRequest, HttpResponse, LoadAccountByToken, Middleware } from './AuthMiddlewareProtocols'
import { AccessDeniedError, forbidden, ok } from './AuthMiddlewareProtocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (!accessToken) return forbidden(new AccessDeniedError())

    const account = await this.loadAccountByToken.load(accessToken)
    if (!account) return forbidden(new AccessDeniedError())
    return ok('')
  }
}
