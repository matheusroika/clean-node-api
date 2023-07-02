import type { Router } from 'express'
import { adaptRoute } from '../../adapters/express/expressRouteAdapter'
import { makeAddSurveyController } from '../../factories/controllers/addSurvey/addSurveyControllerFactory'

export default (router: Router): void => {
  router.post('/surveys', adaptRoute(makeAddSurveyController()))
}
