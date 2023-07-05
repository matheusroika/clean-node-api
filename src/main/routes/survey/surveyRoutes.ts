import { auth } from '@/main/middlewares'
import { adaptRoute } from '@/main/adapters/express/expressRouteAdapter'
import { makeAddSurveyController } from '@/main/factories/controllers/survey/addSurvey/addSurveyControllerFactory'
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/loadSurveys/loadSurveysControllerFactory'
import type { Router } from 'express'

export default (router: Router): void => {
  router.post('/surveys', auth('admin'), adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth(), adaptRoute(makeLoadSurveysController()))
}
