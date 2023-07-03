import { makeLogControllerDecorator } from '../../../decorators/logControllerDecoratorFactory'
import { LoadSurveysController } from '../../../../../presentation/controllers/survey/loadSurveys/LoadSurveysController'
import { makeDbLoadSurveys } from '../../../useCases/loadSurveys/dbLoadSurveys'
import type { Controller } from '../../../../../presentation/protocols'

export const makeLoadSurveysController = (): Controller => {
  const loadSurveysController = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(loadSurveysController)
}
