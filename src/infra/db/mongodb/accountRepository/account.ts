import type { AddAccountRepository } from '../../../../data/protocols/addAccountRepository'
import type { Account } from '../../../../domain/models/account'
import type { AccountValues } from '../../../../domain/usecases/addAccount'
import { MongoHelper } from '../helpers/mongoHelper'

export class AccountMongoRepository implements AddAccountRepository {
  readonly accountCollection = MongoHelper.getCollection('accounts')

  async add (account: AccountValues): Promise<Account> {
    const document = await this.accountCollection.insertOne(account)
    const newAccount = await this.accountCollection.findOne({ _id: document.insertedId })
    if (!newAccount) throw new Error()
    return MongoHelper.map(newAccount)
  }
}
