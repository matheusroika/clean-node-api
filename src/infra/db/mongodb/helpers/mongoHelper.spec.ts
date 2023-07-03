import { mongoHelper as sut } from './mongoHelper'

describe('Mongo Helper', () => {
  describe('Process.env tests', () => {
    const env = process.env

    beforeEach(() => {
      jest.resetModules()
      process.env = { ...env }
    })

    afterEach(() => {
      process.env = env
    })

    test('Should return correct mongoUrl when NODE_ENV === deployment', () => {
      process.env.NODE_ENV = 'deployment'
      const mongoUrl = sut.getMongoUrl()
      expect(mongoUrl).toBe(process.env.MONGO_REMOTE_URL)
    })

    test('Should return correct mongoUrl when NODE_ENV !== deployment and MONGO_URL is set', () => {
      const mongoUrl = sut.getMongoUrl()
      expect(mongoUrl).toBe(process.env.MONGO_URL)
    })

    test('Should return correct mongoUrl when NODE_ENV !== deployment', () => {
      process.env.MONGO_URL = undefined
      const mongoUrl = sut.getMongoUrl()
      expect(mongoUrl).toBe(process.env.MONGO_LOCAL_URL)
    })
  })

  describe('Connect tests', () => {
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

    describe('Connect Spy tests', () => {
      let connectSpy: jest.SpyInstance<Promise<void>, [uri: string], any>

      beforeEach(async () => {
        connectSpy = jest.spyOn(sut, 'connect').mockImplementation(async () => { sut.client = null })
        await sut.disconnect()
      })

      afterEach(async () => {
        connectSpy.mockRestore()
        await sut.connect(process.env.MONGO_URL as string)
      })

      test('Should return false if reconnect made all tries', async () => {
        const reconnectSpy = jest.spyOn(sut, 'reconnect')
        const reconnect = await sut.reconnect(process.env.MONGO_URL as string, 3, 100)
        expect(reconnectSpy).toHaveBeenCalledTimes(3)
        expect(reconnect).toBe(false)
      })
      test('Should throw if getCollection throws', async () => {
        const promise = sut.getCollection('accounts')
        await expect(promise).rejects.toThrow()
      }, 50000)

      test('Should throw if disconnect throws', async () => {
        const promise = sut.disconnect()
        await expect(promise).rejects.toThrow()
      })
    })
  })
})
