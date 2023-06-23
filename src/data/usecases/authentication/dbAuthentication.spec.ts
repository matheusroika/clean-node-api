import type { LoadAccountByEmailRepository } from '../../protocols/loadAccountByEmailRepository'
import type { Account } from '../addAccount/dbAddAccountProtocols'
import { DbAuthentication } from './dbAuthentication'

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<Account> {
      const account: Account = {
        id: 'any_id',
        name: 'Any Name',
        email: 'any@email.com',
        password: 'any_password'
      }
      return account
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

interface Sut {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): Sut => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

describe('Db Authentication Use Case', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth({
      email: 'any@email.com',
      password: 'any_password'
    })
    expect(loadSpy).toHaveBeenCalledWith('any@email.com')
  })
})
