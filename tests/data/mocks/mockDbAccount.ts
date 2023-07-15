import { mockAccount } from '@/../tests/domain/mocks'
import type { Account } from '@/domain/models/Account'
import type { AddAccountParams } from '@/domain/useCases/account/AddAccount'
import type { AddAccountRepository } from '@/data/protocols/db/account/AddAccountRepository'
import type { LoadAccountByEmailRepository } from '@/data/protocols/db/account/LoadAccountByEmailRepository'
import type { LoadAccountByTokenRepository } from '@/data/protocols/db/account/LoadAccountByTokenRepository'
import type { UpdateAccessTokenRepository } from '@/data/protocols/db/account/UpdateAccessTokenRepository'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountParams): Promise<Account> {
      return mockAccount()
    }
  }
  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (loadByEmailReturn: Account | null): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<Account | null> {
      return loadByEmailReturn
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (accessToken: string, role?: string): Promise<Account | null> {
      return mockAccount()
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}
