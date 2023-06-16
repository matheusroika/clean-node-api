import type { Account, AccountValues, AddAccount, AddAccountRepository, Encrypter } from './dbAddAccountProtocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (account: AccountValues): Promise<Account> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    const newAccount = await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    })
    return newAccount
  }
}
