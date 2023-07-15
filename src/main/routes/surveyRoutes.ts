import { auth } from '@/main/middlewares'
import { adaptRoute } from '@/main/adapters/express/expressRouteAdapter'
import { makeAddSurveyController } from '@/main/factories/controllers/survey/addSurveyControllerFactory'
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/loadSurveysControllerFactory'
import type { Router } from 'express'

export default (router: Router): void => {
  router.post('/surveys', auth('admin'), adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth(), adaptRoute(makeLoadSurveysController()))
}
