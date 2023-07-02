import type { Middleware } from '../../../../presentation/protocols'
import { AuthMiddleware } from '../../../../presentation/middlewares/AuthMiddleware'
import { makeDbLoadAccountByToken } from '../../useCases/loadAccountByToken/dbLoadAccountByTokenFactory'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role)
}
