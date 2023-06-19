import { MongoHelper as sut } from './mongoHelper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await sut.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should reconnect if mongodb client is down', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
