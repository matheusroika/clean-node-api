import { MongoHelper } from '../helpers/mongoHelper'
import { ObjectId } from 'mongodb'
import type { AddAccountRepository } from '../../../../data/protocols/db/account/AddAccountRepository'
import type { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/LoadAccountByEmailRepository'
import type { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/UpdateAccessTokenRepository'
import type { Collection } from 'mongodb'
import type { AccountValues } from '../../../../domain/useCases/AddAccount'
import type { Account } from '../../../../domain/models/Account'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
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
    return account ? MongoHelper.map(account) : null
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await this.getAccountCollection()
    await accountCollection.updateOne({
      _id: new ObjectId(id)
    }, {
      $set: {
        accessToken: token
      }
    })
  }
}
