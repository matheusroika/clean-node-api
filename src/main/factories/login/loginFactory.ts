import { LogControllerDecorator } from '../../decorators/log/LogControllerDecorator'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/LogMongoRepository'
import { LoginController } from '../../../presentation/controllers/login/LoginController'
import { makeLoginValidation } from './loginValidationFactory'
import { DbAuthentication } from '../../../data/useCases/authentication/DbAuthentication'
import { JwtAdapter } from '../../../infra/cryptography/JwtAdapter/JwtAdapter'
import { BcryptAdapter } from '../../../infra/cryptography/BcryptAdapter/BcryptAdapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/AccountMongoRepository'
import { cryptoHelper } from '../../../infra/cryptography/helpers/cryptoHelper'
import type { Controller } from '../../../presentation/protocols'

export const makeLoginController = (): Controller => {
  const salt = 12
  const isKey = true
  const keyPath = process.env.NODE_ENV === 'deployment' ? 'jwtRS256.key' : '**/keys/jwt/jwtRS256.key'
  const secret = cryptoHelper.getKeyObject(cryptoHelper.getKeyString(keyPath))
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(secret, isKey)
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const validationComposite = makeLoginValidation()
  const loginController = new LoginController(dbAuthentication, validationComposite)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
