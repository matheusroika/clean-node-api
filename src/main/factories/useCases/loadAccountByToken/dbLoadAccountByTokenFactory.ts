import type { LoadAccountByToken } from '../../../../domain/useCases/LoadAccountByToken'
import { DbLoadAccountByToken } from '../../../../data/useCases/loadAccountByToken/DbLoadAccountByToken'
import { JwtAdapter } from '../../../../infra/cryptography/JwtAdapter/JwtAdapter'
import { cryptoHelper } from '../../../../infra/cryptography/helpers/cryptoHelper'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/AccountMongoRepository'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const isKey = true
  const keyPath = process.env.NODE_ENV === 'deployment' ? './jwtRS256.key.pub' : '**/keys/jwt/jwtRS256.key.pub'
  const secret = cryptoHelper.getPublicKeyObject(cryptoHelper.getKeyString(keyPath))
  const jwtAdapter = new JwtAdapter(secret, isKey)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}