import { LoginController } from '@/presentation/controllers/authentication/login/LoginController'
import { makeDbAuthentication } from '@/main/factories/useCases/authentication/dbAuthenticationFactory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerDecoratorFactory'
import { makeLoginValidation } from './loginValidationFactory'
import type { Controller } from '@/presentation/protocols'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(loginController)
}
