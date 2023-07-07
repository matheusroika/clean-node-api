import type { Account } from '@/domain/models/Account'
import type { AddAccount, AddAccountParams } from '@/domain/useCases/account/AddAccount'
import type { LoadAccountByToken } from '@/domain/useCases/account/LoadAccountByToken'

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'Any Name',
  email: 'any@email.com',
  password: 'any_password'
})

interface AddAccountParamsWithRole extends AddAccountParams {
  role?: string
}

export const mockAddAccountParamsWithRole = (role?: string): AddAccountParamsWithRole => ({
  ...mockAddAccountParams(),
  role
})

export const mockAccount = (): Account => ({
  id: 'any_id',
  name: 'Any Name',
  email: 'any@email.com',
  password: 'hashed_password'
})

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<Account> {
      return mockAccount()
    }
  }
  return new AddAccountStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<Account | null> {
      return mockAccount()
    }
  }
  return new LoadAccountByTokenStub()
}
