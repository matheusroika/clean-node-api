import { LoadSurveyResponseController } from '@/presentation/controllers/surveyResponse/loadSurveyResponse/LoadSurveyResponseController'
import { makeDbLoadSurveyResponse } from '@/main/factories/useCases/surveyResponse/loadSurveyResponse/dbLoadSurveyResponseFactory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerDecoratorFactory'
import type { Controller } from '@/presentation/protocols'

export const makeLoadSurveyResponseController = (): Controller => {
  const loadSurveyResponseController = new LoadSurveyResponseController(makeDbLoadSurveyResponse())
  return makeLogControllerDecorator(loadSurveyResponseController)
}
