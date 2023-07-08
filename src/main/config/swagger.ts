import { serve, setup } from 'swagger-ui-express'
import type { Express } from 'express'
import swaggerConfig from '@/main/docs'

export default (app: Express): void => {
  app.use('/docs', serve, setup(swaggerConfig))
}
