import { BcryptAdapter } from '@/infra/cryptography/BcryptAdapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/AccountMongoRepository'
import { DbAddAccount } from '@/data/useCases/account/DbAddAccount'

export const makeDbAddAccount = (): DbAddAccount => {
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAddAccount(hasher, accountMongoRepository, accountMongoRepository)
}
