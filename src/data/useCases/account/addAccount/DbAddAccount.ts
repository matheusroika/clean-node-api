import type { Account, AccountValues, AddAccount, AddAccountRepository, Hasher, LoadAccountByEmailRepository } from './DbAddAccountProtocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (account: AccountValues): Promise<Account | null> {
    const accountByEmail = await this.loadAccountByEmailRepository.loadByEmail(account.email)
    if (accountByEmail) return null

    const hashedPassword = await this.hasher.hash(account.password)
    const newAccount = await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    })
    return newAccount
  }
}
