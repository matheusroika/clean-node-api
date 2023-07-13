import express from 'express'
import { resolve } from 'path'
import type { Express } from 'express'

export default (app: Express): void => {
  app.use('/static', express.static(resolve(__dirname, '../../static')))
}
