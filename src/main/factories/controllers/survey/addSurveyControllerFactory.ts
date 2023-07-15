import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerDecoratorFactory'
import { makeDbAddSurvey } from '@/main/factories/useCases/survey/dbAddSurveyFactory'
import { AddSurveyController } from '@/presentation/controllers/survey/AddSurveyController'
import { makeAddSurveyValidation } from './addSurveyValidationFactory'
import type { Controller } from '@/presentation/protocols'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(addSurveyController)
}
