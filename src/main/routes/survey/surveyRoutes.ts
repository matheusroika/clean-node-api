import type { Router } from 'express'
import { adaptRoute } from '../../adapters/express/expressRouteAdapter'
import { adaptMiddleware } from '../../adapters/express/expressMiddlewareAdapter'
import { makeAuthMiddleware } from '../../factories/middlewares/authentication/authMiddlewareFactory'
import { makeAddSurveyController } from '../../factories/controllers/survey/addSurvey/addSurveyControllerFactory'
import { makeLoadSurveysController } from '../../factories/controllers/survey/loadSurveys/loadSurveysControllerFactory'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  const auth = adaptMiddleware(makeAuthMiddleware())
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
