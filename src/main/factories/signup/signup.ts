import { BcryptAdapter } from '../../../infra/cryptography/bcryptAdapter/bcryptAdapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/accountRepository/account'
import { LogMongoRepository } from '../../../infra/db/mongodb/logRepository/log'
import { DbAddAccount } from '../../../data/usecases/addAccount/dbAddAccount'
import { SignUpController } from '../../../presentation/controllers/signup/signup'
import { LogControllerDecorator } from '../../decorators/log'
import { makeSignUpValidation } from './signupValidation'
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
