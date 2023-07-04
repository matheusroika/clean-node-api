import { SignUpController } from '@/presentation/controllers/authentication/signUp/SignUpController'
import { makeSignUpValidation } from './signUpValidationFactory'
import { makeDbAuthentication } from '@/main/factories/useCases/authentication/dbAuthenticationFactory'
import { makeDbAddAccount } from '@/main/factories/useCases/addAccount/dbAddAccountFactory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerDecoratorFactory'
import type { Controller } from '@/presentation/protocols'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(signUpController)
}
