import type { Account, AccountValues, AddAccount, AddAccountRepository, Encrypter } from './dbAddAccountProtocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (accountData: AccountValues): Promise<Account> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    })
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
