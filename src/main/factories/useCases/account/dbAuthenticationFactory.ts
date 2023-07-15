import { cryptoHelper } from '@/infra/cryptography/cryptoHelper'
import { AccountMongoRepository } from '@/infra/db/mongodb/AccountMongoRepository'
import { BcryptAdapter } from '@/infra/cryptography/BcryptAdapter'
import { JwtAdapter } from '@/infra/cryptography/JwtAdapter'
import { DbAuthentication } from '@/data/useCases/account/DbAuthentication'

export const makeDbAuthentication = (): DbAuthentication => {
  const salt = 12
  const isKey = true
  const keyPath = process.env.NODE_ENV === 'deployment' ? /* istanbul ignore next */ './jwtRS256.key' : '**/keys/jwt/jwtRS256.key'
  const secret = cryptoHelper.getPrivateKeyObject(cryptoHelper.getKeyString(keyPath))
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(secret, isKey)
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}
