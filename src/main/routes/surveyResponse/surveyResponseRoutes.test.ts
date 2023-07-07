import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '@/main/config/app'
import { mongoHelper } from '@/infra/db/mongodb/helpers/mongoHelper'
import { cryptoHelper } from '@/infra/cryptography/helpers/cryptoHelper'
import type { SurveyParams } from '@/domain/useCases/survey/AddSurvey'
import type { AccountParams } from '@/domain/useCases/account/AddAccount'

const makeFakeSurveyParams = (): SurveyParams => ({
  question: 'Question',
  answers: [{
    answer: 'Answer 1',
    image: 'http://image.com/image.png'
  }, {
    answer: 'Answer 2'
  }]
})

interface AccountParamsWithRole extends AccountParams {
  role?: string
}

const makeFakeAccountParams = (role?: string): AccountParamsWithRole => ({
  name: 'Any Name',
  email: 'any@email.com',
  password: 'any_password',
  role
})

const makeAccessToken = async (role?: string): Promise<string> => {
  const accountCollection = await mongoHelper.getCollection('accounts')
  const document = await accountCollection.insertOne(makeFakeAccountParams(role))
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

const makeSurveyId = async (): Promise<string> => {
  const surveyCollection = await mongoHelper.getCollection('surveys')
  const document = await surveyCollection.insertOne({
    ...makeFakeSurveyParams(),
    date: new Date('2023-07-03T05:52:28.514Z')
  })
  return document.insertedId.toString()
}

describe('Survey Response Routes', () => {
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

  describe('Save Survey Response Route', () => {
    test('Should return 403 on PUT /surveys/:surveyId/response without accessToken', async () => {
      const surveyId = await makeSurveyId()
      await request(app)
        .put(`/api/surveys/${surveyId}/response`)
        .send({ answer: 'any_answer' })
        .expect(403)
    })

    test('Should return 403 on PUT /surveys/:surveyId/response without valid surveyId', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
        .put('/api/surveys/invalid_id/response')
        .set('x-access-token', accessToken)
        .send({ answer: 'any_answer' })
        .expect(403)
    })

    test('Should return 200 on PUT /surveys/:surveyId/response with accessToken', async () => {
      const accessToken = await makeAccessToken()
      const surveyId = await makeSurveyId()
      await request(app)
        .put(`/api/surveys/${surveyId}/response`)
        .set('x-access-token', accessToken)
        .send({ answer: 'Answer 1' })
        .expect(200)
    })
  })
})
