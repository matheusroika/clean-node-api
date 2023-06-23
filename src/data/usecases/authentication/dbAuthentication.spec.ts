import { DbAuthentication } from './dbAuthentication'
import type { AuthValues } from '../../../domain/usecases/authentication'
import type { LoadAccountByEmailRepository } from '../../protocols/db/loadAccountByEmailRepository'
import type { Account } from '../addAccount/dbAddAccountProtocols'

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<Account> {
      return makeFakeAccount()
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

const makeFakeAccount = (): Account => ({
  id: 'any_id',
  name: 'Any Name',
  email: 'any@email.com',
  password: 'any_password'
})

const makeFakeAuthValues = (): AuthValues => ({
  email: 'any@email.com',
  password: 'any_password'
})

describe('Db Authentication Use Case', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthValues())
    expect(loadSpy).toHaveBeenCalledWith('any@email.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockImplementationOnce(async () => { throw new Error() })
    const promise = sut.auth(makeFakeAuthValues())
    await expect(promise).rejects.toThrow()
  })
})
