import { BcryptAdapter } from '../../../infra/cryptography/bcryptAdapter/BcryptAdapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/AccountMongoRepository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/LogMongoRepository'
import { DbAddAccount } from '../../../data/useCases/addAccount/DbAddAccount'
import { SignUpController } from '../../../presentation/controllers/signUp/SignUpController'
import { LogControllerDecorator } from '../../decorators/log/LogControllerDecorator'
import { makeSignUpValidation } from './signUpValidationFactory'
import type { Controller } from '../../../presentation/protocols'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(hasher, addAccountRepository)
  const validationComposite = makeSignUpValidation()
  const signUpController = new SignUpController(addAccount, validationComposite)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
