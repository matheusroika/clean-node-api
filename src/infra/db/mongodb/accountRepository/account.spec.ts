import type { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongoHelper'
import { AccountMongoRepository } from './account'

interface Sut {
  sut: AccountMongoRepository
  accountCollection: Collection
}

const makeSut = (): Sut => {
  const sut = new AccountMongoRepository()
  const accountCollection = MongoHelper.getCollection('accounts')
  return {
    sut,
    accountCollection
  }
}

describe('Account MongoDB Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add({
      name: 'Any Name',
      email: 'any@email.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('Any Name')
    expect(account.email).toBe('any@email.com')
    expect(account.password).toBe('any_password')
  })

  test('Should throw if accountCollection.insertOne throws', async () => {
    const { sut, accountCollection } = makeSut()
    jest.spyOn(sut, 'getAccountCollection').mockReturnValue(accountCollection)
    jest.spyOn(accountCollection, 'insertOne').mockImplementation(() => { throw new Error() })
    const promise = sut.add({
      name: 'Any Name',
      email: 'any@email.com',
      password: 'any_password'
    })
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if accountCollection.findOne throws', async () => {
    const { sut, accountCollection } = makeSut()
    jest.spyOn(sut, 'getAccountCollection').mockReturnValue(accountCollection)
    jest.spyOn(accountCollection, 'findOne').mockImplementation(() => { throw new Error() })
    const promise = sut.add({
      name: 'Any Name',
      email: 'any@email.com',
      password: 'any_password'
    })
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if new account can\'t be found on DB', async () => {
    const { sut, accountCollection } = makeSut()
    jest.spyOn(sut, 'getAccountCollection').mockReturnValue(accountCollection)
    jest.spyOn(accountCollection, 'findOne').mockResolvedValue(null)
    const promise = sut.add({
      name: 'Any Name',
      email: 'any@email.com',
      password: 'any_password'
    })
    await expect(promise).rejects.toThrow()
  })
})
