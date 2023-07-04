import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerDecoratorFactory'
import { AddSurveyController } from '@/presentation/controllers/survey/addSurvey/AddSurveyController'
import { makeAddSurveyValidation } from './addSurveyValidationFactory'
import { makeDbAddSurvey } from '@/main/factories/useCases/addSurvey/dbAddSurveyFactory'
import type { Controller } from '@/presentation/protocols'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(addSurveyController)
}
