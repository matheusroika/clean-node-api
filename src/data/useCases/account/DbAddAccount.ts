import type { Account } from '@/domain/models/Account'
import type { AddAccount, AddAccountParams } from '@/domain/useCases/account/AddAccount'
import type { Hasher } from '@/data/protocols/cryptography/Hasher'
import type { AddAccountRepository } from '@/data/protocols/db/account/AddAccountRepository'
import type { LoadAccountByEmailRepository } from '@/data/protocols/db/account/LoadAccountByEmailRepository'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (account: AddAccountParams): Promise<Account | null> {
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
