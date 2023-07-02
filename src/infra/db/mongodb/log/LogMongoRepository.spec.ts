import type { Collection } from 'mongodb'
import { mongoHelper } from '../helpers/mongoHelper'
import { LogMongoRepository } from './LogMongoRepository'

interface Sut {
  sut: LogMongoRepository
  errorCollection: Collection
}

const makeSut = async (): Promise<Sut> => {
  const sut = new LogMongoRepository()
  const errorCollection = await mongoHelper.getCollection('errors')
  return {
    sut,
    errorCollection
  }
}

describe('Log Mongo Repository', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  beforeEach(async () => {
    const errorCollection = await mongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('Should create an error log in DB on success', async () => {
    const { sut, errorCollection } = await makeSut()
    await sut.logError('Any error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
