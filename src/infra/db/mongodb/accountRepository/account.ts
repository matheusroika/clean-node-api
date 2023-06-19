import type { Collection } from 'mongodb'
import type { AddAccountRepository } from '../../../../data/protocols/addAccountRepository'
import type { Account } from '../../../../domain/models/account'
import type { AccountValues } from '../../../../domain/usecases/addAccount'
import { MongoHelper } from '../helpers/mongoHelper'

export class AccountMongoRepository implements AddAccountRepository {
  async getAccountCollection (): Promise<Collection> {
    return await MongoHelper.getCollection('accounts')
  }

  async add (account: AccountValues): Promise<Account> {
    const accountCollection = await this.getAccountCollection()
    const document = await accountCollection.insertOne(account)
    const newAccount = await accountCollection.findOne({ _id: document.insertedId })
    if (!newAccount) throw new Error()
    return MongoHelper.map(newAccount)
  }
}
