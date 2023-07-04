import type { NextFunction, Request, Response } from 'express'
import type { HttpRequest, Middleware } from '@/presentation/protocols'

const successStatusCodes = [200]
export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }
    const httpResponse = await middleware.handle(httpRequest)
    if (successStatusCodes.includes(httpResponse.statusCode)) {
      Object.assign(req, httpResponse.body)
      next()
    } else {
      res.status(httpResponse.statusCode).send({
        error: httpResponse.body.message
      })
    }
  }
}
