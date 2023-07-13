import { auth } from '@/main/middlewares'
import { adaptRoute } from '@/main/adapters/express/expressRouteAdapter'
import { makeSaveSurveyResponseController } from '@/main/factories/controllers/surveyResponse/saveSurveyResponse/saveSurveyResponseControllerFactory'
import { makeLoadSurveyResponseController } from '@/main/factories/controllers/surveyResponse/loadSurveyResponse/loadSurveyResponseControllerFactory'
import type { Router } from 'express'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/response', auth(), adaptRoute(makeSaveSurveyResponseController()))
  router.get('/surveys/:surveyId/response', auth(), adaptRoute(makeLoadSurveyResponseController()))
}
