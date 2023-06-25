import { MongoHelper } from '../helpers/mongoHelper'
import { AccountMongoRepository } from './account'
import type { Collection } from 'mongodb'
import type { AccountValues } from '../../../../domain/usecases/addAccount'
import type { Account } from '../../../../domain/models/account'

interface Sut {
  sut: AccountMongoRepository
  promiseAccountCollection: Promise<Collection>
  accountCollection: Collection
}

const makeSut = async (): Promise<Sut> => {
  const sut = new AccountMongoRepository()
  const promiseAccountCollection = MongoHelper.getCollection('accounts')
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
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return an account on Account.add success', async () => {
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

  test('Should return an account on Account.loadByEmail success', async () => {
    const { sut } = await makeSut()
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.insertOne(makeFakeAccountValues())
    const account = await sut.loadByEmail('any@email.com') as Account
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('Any Name')
    expect(account.email).toBe('any@email.com')
    expect(account.password).toBe('any_password')
  })
})
