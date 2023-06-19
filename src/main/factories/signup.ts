import { EmailValidatorAdapter } from '../../utils/emailValidatorAdapter'
import { BcryptAdapter } from '../../infra/cryptography/bcryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/accountRepository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/logRepository/log'
import { DbAddAccount } from '../../data/usecases/addAccount/dbAddAccount'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { LogControllerDecorator } from '../decorators/log'
import type { Controller } from '../../presentation/protocols'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidator = new EmailValidatorAdapter()
  const encrypter = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(encrypter, addAccountRepository)
  const signUpController = new SignUpController(emailValidator, addAccount)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
