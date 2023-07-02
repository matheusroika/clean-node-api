import { LoginController } from '../../../../presentation/controllers/authentication/login/LoginController'
import { makeLoginValidation } from './loginValidationFactory'
import { makeDbAuthentication } from '../../useCases/authentication/dbAuthenticationFactory'
import { makeLogControllerDecorator } from '../../decorators/logControllerDecoratorFactory'
import type { Controller } from '../../../../presentation/protocols'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(loginController)
}
