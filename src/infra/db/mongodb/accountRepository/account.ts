import type { AddAccountRepository } from '../../../../data/protocols/addAccountRepository'
import type { Account } from '../../../../domain/models/account'
import type { AccountValues } from '../../../../domain/usecases/addAccount'
import { MongoHelper } from '../helpers/mongoHelper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (account: AccountValues): Promise<Account> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const document = await accountCollection.insertOne(account)
    const newAccount = await accountCollection.findOne({ _id: document.insertedId })
    if (!newAccount) throw new Error()
    const { _id, ...accountWithoutId } = newAccount
    const formattedAccount = {
      id: _id,
      ...accountWithoutId
    } as unknown as Account
    return formattedAccount
  }
}
