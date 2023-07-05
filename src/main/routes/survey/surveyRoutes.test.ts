import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '@/main/config/app'
import { mongoHelper } from '@/infra/db/mongodb/helpers/mongoHelper'
import { cryptoHelper } from '@/infra/cryptography/helpers/cryptoHelper'
import type { Survey } from '@/domain/models/Survey'
import type { AddSurveyValues } from '@/domain/useCases/AddSurvey'
import type { AccountValues } from '@/domain/useCases/AddAccount'

const makeFakeSurveyValues = (): AddSurveyValues => ({
  question: 'Question',
  answers: [{
    answer: 'Answer 1',
    image: 'http://image.com/image.png'
  }, {
    answer: 'Answer 2'
  }]
})

const makeFakeSurveys = (): Survey[] => ([
  {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date('2023-07-02T05:52:28.514Z')
  },
  {
    question: 'other_question',
    answers: [{
      image: 'other_image',
      answer: 'other_answer'
    }],
    date: new Date('2023-07-03T05:52:28.514Z')
  }
])

interface AccountValuesWithRole extends AccountValues {
  role?: string
}

const makeFakeAccountValues = (role?: string): AccountValuesWithRole => ({
  name: 'Any Name',
  email: 'any@email.com',
  password: 'any_password',
  role
})

const createFakeUserAndMakeAccessToken = async (role?: string): Promise<string> => {
  const accountCollection = await mongoHelper.getCollection('accounts')
  const document = await accountCollection.insertOne(makeFakeAccountValues(role))
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
        .send(makeFakeSurveyValues())
        .expect(403)
    })

    test('Should return 403 on POST /surveys from an account that doesn\'t have admin role with accessToken', async () => {
      const accessToken = await createFakeUserAndMakeAccessToken()
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(makeFakeSurveyValues())
        .expect(403)
    })

    test('Should return 204 on POST /surveys with valid accessToken', async () => {
      const accessToken = await createFakeUserAndMakeAccessToken('admin')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(makeFakeSurveyValues())
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
      const accessToken = await createFakeUserAndMakeAccessToken()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
