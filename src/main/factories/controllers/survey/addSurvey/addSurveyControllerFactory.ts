import { makeLogControllerDecorator } from '../../../decorators/logControllerDecoratorFactory'
import { AddSurveyController } from '../../../../../presentation/controllers/survey/addSurvey/AddSurveyController'
import { makeAddSurveyValidation } from './addSurveyValidationFactory'
import { makeDbAddSurvey } from '../../../useCases/addSurvey/dbAddSurveyFactory'
import type { Controller } from '../../../../../presentation/protocols'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecorator(addSurveyController)
}
