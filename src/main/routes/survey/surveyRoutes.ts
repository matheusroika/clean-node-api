import type { Router } from 'express'
import { adaptRoute } from '../../adapters/express/expressRouteAdapter'
import { adaptMiddleware } from '../../adapters/express/expressMiddlewareAdapter'
import { makeAddSurveyController } from '../../factories/controllers/survey/addSurvey/addSurveyControllerFactory'
import { makeAuthMiddleware } from '../../factories/middlewares/authentication/authMiddlewareFactory'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
}
