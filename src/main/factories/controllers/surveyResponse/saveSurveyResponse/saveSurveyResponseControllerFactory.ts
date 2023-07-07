import { SaveSurveyResponseController } from '@/presentation/controllers/surveyResponse/saveSurveyResponse/SaveSurveyResponseController'
import { makeDbLoadSurveyByIdFactory } from '@/main/factories/useCases/survey/loadSurveyById/dbLoadSurveyByIdFactory'
import { makeDbSaveSurveyResponse } from '@/main/factories/useCases/surveyResponse/saveSurveyResponse/dbSaveSurveyResponseFactory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerDecoratorFactory'
import type { Controller } from '@/presentation/protocols'

export const makeSaveSurveyResponseController = (): Controller => {
  const saveSurveyResponseController = new SaveSurveyResponseController(makeDbLoadSurveyByIdFactory(), makeDbSaveSurveyResponse())
  return makeLogControllerDecorator(saveSurveyResponseController)
}
