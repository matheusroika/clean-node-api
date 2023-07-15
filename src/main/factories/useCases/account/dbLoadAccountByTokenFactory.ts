import { cryptoHelper } from '@/infra/cryptography/cryptoHelper'
import { JwtAdapter } from '@/infra/cryptography/JwtAdapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/AccountMongoRepository'
import { DbLoadAccountByToken } from '@/data/useCases/account/DbLoadAccountByToken'
import type { LoadAccountByToken } from '@/domain/useCases/account/LoadAccountByToken'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const isKey = true
  const keyPath = process.env.NODE_ENV === 'deployment' ? /* istanbul ignore next */ './jwtRS256.key.pub' : '**/keys/jwt/jwtRS256.key.pub'
  const secret = cryptoHelper.getPublicKeyObject(cryptoHelper.getKeyString(keyPath))
  const jwtAdapter = new JwtAdapter(secret, isKey)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
