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
})
