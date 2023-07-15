import { makeDbLoadAccountByToken } from '@/main/factories/useCases/account/dbLoadAccountByTokenFactory'
import { AuthMiddleware } from '@/presentation/middlewares/AuthMiddleware'
import type { Middleware } from '@/presentation/protocols'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role)
}
