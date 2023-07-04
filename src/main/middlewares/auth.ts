import type { NextFunction, Request, Response } from 'express'
import { adaptMiddleware } from '@/main/adapters/express/expressMiddlewareAdapter'
import { makeAuthMiddleware } from '@/main/factories/middlewares/authentication/authMiddlewareFactory'

export const auth = (role?: string): (req: Request, res: Response, next: NextFunction) => Promise<void> => {
  return adaptMiddleware(makeAuthMiddleware(role))
}
