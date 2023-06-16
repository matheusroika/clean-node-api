import type { Account } from '../../../domain/models/account'
import type { AccountValues, AddAccount } from '../../../domain/usecases/addAccount'
import type { Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AccountValues): Promise<Account> {
    await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => {
      resolve({
        id: '',
        email: '',
        name: '',
        password: ''
      })
    })
  }
}
