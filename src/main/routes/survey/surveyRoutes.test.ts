import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '@/main/config/app'
import { mongoHelper } from '@/infra/db/mongodb/helpers/mongoHelper'
import { cryptoHelper } from '@/infra/cryptography/helpers/cryptoHelper'
import { mockAddSurveyParamsIntegration } from '@/domain/tests'
import type { Survey } from '@/domain/models/Survey'
import type { AddAccountParams } from '@/domain/useCases/account/AddAccount'

const makeFakeSurveys = (): Survey[] => ([
  {
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date('2023-07-02T05:52:28.514Z')
  },
  {
    id: 'other_id',
    question: 'other_question',
    answers: [{
      image: 'other_image',
      answer: 'other_answer'
    }],
    date: new Date('2023-07-03T05:52:28.514Z')
  }
])

interface AddAccountParamsWithRole extends AddAccountParams {
  role?: string
}

const makeFakeAddAccountParams = (role?: string): AddAccountParamsWithRole => ({
  name: 'Any Name',
  email: 'any@email.com',
  password: 'any_password',
  role
})

const makeAccessToken = async (role?: string): Promise<string> => {
  const accountCollection = await mongoHelper.getCollection('accounts')
  const document = await accountCollection.insertOne(makeFakeAddAccountParams(role))
  const newAccount = await accountCollection.findOne({ _id: document.insertedId })
  const id = newAccount?._id
  const keyPath = process.env.NODE_ENV === 'deployment' ? './jwtRS256.key' : '**/keys/jwt/jwtRS256.key'
  const secret = cryptoHelper.getPrivateKeyObject(cryptoHelper.getKeyString(keyPath))
  const accessToken = jwt.sign({ id }, secret, { algorithm: 'RS256' })
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  beforeEach(async () => {
    const surveyCollection = await mongoHelper.getCollection('surveys')
    const accountCollection = await mongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('Add Survey Route', () => {
    test('Should return 403 on POST /surveys without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send(mockAddSurveyParamsIntegration())
        .expect(403)
    })

    test('Should return 403 on POST /surveys from an account that doesn\'t have admin role with accessToken', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(mockAddSurveyParamsIntegration())
        .expect(403)
    })

    test('Should return 204 on POST /surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken('admin')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(mockAddSurveyParamsIntegration())
        .expect(204)
    })
  })
  describe('Load Surveys Route', () => {
    test('Should return 403 on GET /surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 200 on GET /surveys with valid accessToken', async () => {
      const surveysCollection = await mongoHelper.getCollection('surveys')
      await surveysCollection.insertMany(makeFakeSurveys())
      const accessToken = await makeAccessToken()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
