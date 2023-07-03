import type { Router } from 'express'
import { adaptRoute } from '../../adapters/express/expressRouteAdapter'
import { makeAddSurveyController } from '../../factories/controllers/survey/addSurvey/addSurveyControllerFactory'
import { makeLoadSurveysController } from '../../factories/controllers/survey/loadSurveys/loadSurveysControllerFactory'
import { auth } from '../../middlewares'

export default (router: Router): void => {
  router.post('/surveys', auth('admin'), adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth(), adaptRoute(makeLoadSurveysController()))
}
