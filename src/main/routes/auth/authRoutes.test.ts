import request from 'supertest'
import app from '../../config/app'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongoHelper'
import bcrypt from 'bcrypt'

describe('Authentication Routes', () => {
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

  describe('Sign Up Route', () => {
    test('Should return 200 on POST /signup success', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Any Name',
          email: 'any@email.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(200)
    })
  })

  describe('Login Route', () => {
    test('Should return 200 on POST /login success', async () => {
      const accountCollection = await MongoHelper.getCollection('accounts')
      const password = await bcrypt.hash('any_password', 12)
      await accountCollection.insertOne({
        name: 'Any Name',
        email: 'any@email.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'any@email.com',
          password: 'any_password'
        })
        .expect(200)
    })

    test('Should return 401 on POST /login fail', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any@email.com',
          password: 'any_password'
        })
        .expect(401)
    })
  })
})
