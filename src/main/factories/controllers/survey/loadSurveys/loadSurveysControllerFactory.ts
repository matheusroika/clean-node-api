import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerDecoratorFactory'
import { makeDbLoadSurveys } from '@/main/factories/useCases/loadSurveys/dbLoadSurveys'
import { LoadSurveysController } from '@/presentation/controllers/survey/loadSurveys/LoadSurveysController'
import type { Controller } from '@/presentation/protocols'

export const makeLoadSurveysController = (): Controller => {
  const loadSurveysController = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(loadSurveysController)
}
