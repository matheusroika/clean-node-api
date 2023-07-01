import { BcryptAdapter } from '../../../../infra/cryptography/BcryptAdapter/BcryptAdapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/AccountMongoRepository'
import { DbAddAccount } from '../../../../data/useCases/addAccount/DbAddAccount'

export const makeDbAddAccount = (): DbAddAccount => {
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  return new DbAddAccount(hasher, addAccountRepository)
}
