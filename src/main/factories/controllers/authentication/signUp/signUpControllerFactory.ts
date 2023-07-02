import { SignUpController } from '../../../../../presentation/controllers/authentication/signUp/SignUpController'
import { makeSignUpValidation } from './signUpValidationFactory'
import { makeDbAuthentication } from '../../../useCases/authentication/dbAuthenticationFactory'
import { makeDbAddAccount } from '../../../useCases/addAccount/dbAddAccountFactory'
import { makeLogControllerDecorator } from '../../../decorators/logControllerDecoratorFactory'
import type { Controller } from '../../../../../presentation/protocols'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(signUpController)
}
