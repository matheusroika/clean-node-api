import type { Collection } from 'mongodb'
import type { AddAccountRepository } from '../../../../data/protocols/db/addAccountRepository'
import { MongoHelper } from '../helpers/mongoHelper'
import type { Account } from '../../../../domain/models/account'
import type { AccountValues } from '../../../../domain/usecases/addAccount'
import type { LoadAccountByEmailRepository } from '../../../../data/protocols/db/loadAccountByEmailRepository'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
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

  async loadByEmail (email: string): Promise<Account | null> {
    const accountCollection = await this.getAccountCollection()
    const account = await accountCollection.findOne({ email })
    if (!account) throw new Error()
    return MongoHelper.map(account)
  }
}
