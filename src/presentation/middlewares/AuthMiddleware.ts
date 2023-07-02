import type { HttpRequest, HttpResponse, Middleware } from './AuthMiddlewareProtocols'
import { AccessDeniedError, forbidden } from './AuthMiddlewareProtocols'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return forbidden(new AccessDeniedError())
  }
}
