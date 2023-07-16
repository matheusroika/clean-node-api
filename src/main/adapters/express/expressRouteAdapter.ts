import type { Request, Response } from 'express'
import type { Controller } from '@/presentation/protocols'

const successStatusCodes = [200, 204]
export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request = {
      ...(req.body || {}),
      ...(req.params || {}),
      accountId: req.accountId
    }
    const httpResponse = await controller.handle(request)
    if (successStatusCodes.includes(httpResponse.statusCode)) {
      res.status(httpResponse.statusCode).send(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).send({
        error: httpResponse.body.message
      })
    }
  }
}
