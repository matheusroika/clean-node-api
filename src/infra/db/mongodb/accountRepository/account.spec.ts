import { MongoHelper } from '../helpers/mongoHelper'
import { AccountMongoRepository } from './account'

const makeSut = (): AccountMongoRepository => {
  const sut = new AccountMongoRepository()
  return sut
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
    const sut = makeSut()
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

  test('Should throw if collection.insertOne throws', async () => {
    const sut = makeSut()
    jest.spyOn(sut.accountCollection, 'insertOne').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add({
      name: 'Any Name',
      email: 'any@email.com',
      password: 'any_password'
    })
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if collection.findOne throws', async () => {
    const sut = makeSut()
    jest.spyOn(sut.accountCollection, 'findOne').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add({
      name: 'Any Name',
      email: 'any@email.com',
      password: 'any_password'
    })
    await expect(promise).rejects.toThrow()
  })
})
