import { LoadSurveyResponseController } from '@/presentation/controllers/surveyResponse/LoadSurveyResponseController'
import { makeDbLoadSurveyResponse } from '@/main/factories/useCases/surveyResponse/dbLoadSurveyResponseFactory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerDecoratorFactory'
import type { Controller } from '@/presentation/protocols'

export const makeLoadSurveyResponseController = (): Controller => {
  const loadSurveyResponseController = new LoadSurveyResponseController(makeDbLoadSurveyResponse())
  return makeLogControllerDecorator(loadSurveyResponseController)
}
