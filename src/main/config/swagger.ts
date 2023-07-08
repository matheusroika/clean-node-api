import { serve, setup } from 'swagger-ui-express'
import type { Express } from 'express'
import swaggerConfig from '@/main/docs'
import { noCache } from '@/main/middlewares'

export default (app: Express): void => {
  app.use('/docs', noCache, serve, setup(swaggerConfig))
}
