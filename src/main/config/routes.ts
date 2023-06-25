import { Router } from 'express'
import fg from 'fast-glob'
import type { Express } from 'express'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  fg.sync('../routes/**/**Routes.{ts,js}', { cwd: __dirname }).map(async file => {
    (await import(file)).default(router)
  })
}
