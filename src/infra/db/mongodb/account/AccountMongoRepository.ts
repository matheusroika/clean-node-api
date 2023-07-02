import { mongoHelper } from '../helpers/mongoHelper'
import { ObjectId } from 'mongodb'
import type { AddAccountRepository } from '../../../../data/protocols/db/account/AddAccountRepository'
import type { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/LoadAccountByEmailRepository'
import type { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/UpdateAccessTokenRepository'
import type { LoadAccountByTokenRepository } from '../../../../data/useCases/loadAccountByToken/DbLoadAccountByTokenProtocols'
import type { AccountValues } from '../../../../domain/useCases/AddAccount'
import type { Account } from '../../../../domain/models/Account'
import type { Collection } from 'mongodb'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async getAccountCollection (): Promise<Collection> {
    return await mongoHelper.getCollection('accounts')
  }

  async add (account: AccountValues): Promise<Account> {
    const accountCollection = await this.getAccountCollection()
    const document = await accountCollection.insertOne(account)
    const newAccount = await accountCollection.findOne({ _id: document.insertedId })
    if (!newAccount) throw new Error()
    return mongoHelper.map(newAccount)
  }

  async loadByEmail (email: string): Promise<Account | null> {
    const accountCollection = await this.getAccountCollection()
    const account = await accountCollection.findOne({ email })
    return account ? mongoHelper.map(account) : null
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

  async loadByToken (accessToken: string, role?: string): Promise<Account | null> {
    const accountCollection = await this.getAccountCollection()
    const account = await accountCollection.findOne({
      accessToken,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    })
    return account ? mongoHelper.map(account) : null
  }
}
