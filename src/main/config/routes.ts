import { Router } from 'express'
import fg from 'fast-glob'
import type { Express } from 'express'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  fg.sync('**/src/main/routes/**Routes.ts').map(async file => {
    console.log(file);
    (await import(`../../../${file}`)).default(router)
  })
}
