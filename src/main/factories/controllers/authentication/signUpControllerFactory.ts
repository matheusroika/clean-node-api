import { SignUpController } from '@/presentation/controllers/authentication/SignUpController'
import { makeDbAuthentication } from '@/main/factories/useCases/account/dbAuthenticationFactory'
import { makeDbAddAccount } from '@/main/factories/useCases/account/dbAddAccountFactory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerDecoratorFactory'
import { makeSignUpValidation } from './signUpValidationFactory'
import type { Controller } from '@/presentation/protocols'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(signUpController)
}
