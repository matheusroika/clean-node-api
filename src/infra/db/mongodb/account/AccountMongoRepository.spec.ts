import { mongoHelper } from '../helpers/mongoHelper'
import { AccountMongoRepository } from './AccountMongoRepository'
import type { Collection } from 'mongodb'
import type { AccountValues } from '@/domain/useCases/AddAccount'
import type { Account } from '@/domain/models/Account'

interface Sut {
  sut: AccountMongoRepository
  promiseAccountCollection: Promise<Collection>
  accountCollection: Collection
}

const makeSut = async (): Promise<Sut> => {
  const sut = new AccountMongoRepository()
  const promiseAccountCollection = mongoHelper.getCollection('accounts')
  const accountCollection = await promiseAccountCollection
  return {
    sut,
    promiseAccountCollection,
    accountCollection
  }
}

const makeFakeAccountValues = (): AccountValues => ({
  name: 'Any Name',
  email: 'any@email.com',
  password: 'any_password'
})

describe('Account MongoDB Repository', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await mongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('AddAccountRepository', () => {
    test('Should return an account on add success', async () => {
      const { sut } = await makeSut()
      const account = await sut.add(makeFakeAccountValues())
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('Any Name')
      expect(account.email).toBe('any@email.com')
      expect(account.password).toBe('any_password')
    })

    test('Should throw if accountCollection.insertOne throws', async () => {
      const { sut, promiseAccountCollection, accountCollection } = await makeSut()
      jest.spyOn(sut, 'getAccountCollection').mockReturnValue(promiseAccountCollection)
      jest.spyOn(accountCollection, 'insertOne').mockImplementation(() => { throw new Error() })
      const promise = sut.add(makeFakeAccountValues())
      await expect(promise).rejects.toThrow()
    })

    test('Should throw if accountCollection.findOne throws', async () => {
      const { sut, promiseAccountCollection, accountCollection } = await makeSut()
      jest.spyOn(sut, 'getAccountCollection').mockReturnValue(promiseAccountCollection)
      jest.spyOn(accountCollection, 'findOne').mockImplementation(() => { throw new Error() })
      const promise = sut.add(makeFakeAccountValues())
      await expect(promise).rejects.toThrow()
    })

    test('Should throw if new account can\'t be found on DB', async () => {
      const { sut, promiseAccountCollection, accountCollection } = await makeSut()
      jest.spyOn(sut, 'getAccountCollection').mockReturnValue(promiseAccountCollection)
      jest.spyOn(accountCollection, 'findOne').mockResolvedValue(null)
      const promise = sut.add(makeFakeAccountValues())
      await expect(promise).rejects.toThrow()
    })
  })

  describe('LoadAccountByEmailRepository', () => {
    test('Should return an account on loadByEmail success', async () => {
      const { sut } = await makeSut()
      const accountCollection = await mongoHelper.getCollection('accounts')
      await accountCollection.insertOne(makeFakeAccountValues())
      const account = await sut.loadByEmail('any@email.com') as Account
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('Any Name')
      expect(account.email).toBe('any@email.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return null if loadByEmail fails', async () => {
      const { sut } = await makeSut()
      const account = await sut.loadByEmail('any@email.com')
      expect(account).toBeNull()
    })
  })

  describe('UpdateAccessTokenRepository', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const { sut } = await makeSut()
      const accountCollection = await mongoHelper.getCollection('accounts')
      const document = await accountCollection.insertOne(makeFakeAccountValues())
      const id = document.insertedId
      const account = await accountCollection.findOne({ _id: id })
      expect(account?.accessToken).toBeFalsy()
      await sut.updateAccessToken(id.toString(), 'any_token')
      const updatedAccount = await accountCollection.findOne({ _id: id })
      expect(updatedAccount).toBeTruthy()
      expect(updatedAccount?.accessToken).toBe('any_token')
    })
  })

  describe('LoadAccountByTokenRepository', () => {
    test('Should return an account on loadByToken without role', async () => {
      const { sut } = await makeSut()
      const accountCollection = await mongoHelper.getCollection('accounts')
      const accountValues = {
        ...makeFakeAccountValues(),
        accessToken: 'any_token'
      }
      await accountCollection.insertOne(accountValues)
      const account = await sut.loadByToken('any_token') as Account
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('Any Name')
      expect(account.email).toBe('any@email.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return an account on loadByToken with role', async () => {
      const { sut } = await makeSut()
      const accountCollection = await mongoHelper.getCollection('accounts')
      const accountValues = {
        ...makeFakeAccountValues(),
        accessToken: 'any_token',
        role: 'any_role'
      }
      await accountCollection.insertOne(accountValues)
      const account = await sut.loadByToken('any_token', 'any_role') as Account
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('Any Name')
      expect(account.email).toBe('any@email.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return an account on loadByToken if user is admin', async () => {
      const { sut } = await makeSut()
      const accountCollection = await mongoHelper.getCollection('accounts')
      const accountValues = {
        ...makeFakeAccountValues(),
        accessToken: 'any_token',
        role: 'admin'
      }
      await accountCollection.insertOne(accountValues)
      const account = await sut.loadByToken('any_token') as Account
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('Any Name')
      expect(account.email).toBe('any@email.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const { sut } = await makeSut()
      const accountCollection = await mongoHelper.getCollection('accounts')
      const accountValues = {
        ...makeFakeAccountValues(),
        accessToken: 'any_token'
      }
      await accountCollection.insertOne(accountValues)
      const account = await sut.loadByToken('any_token', 'any_role')
      expect(account).toBeNull()
    })

    test('Should return null if loadByToken fails', async () => {
      const { sut } = await makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeNull()
    })
  })
})
