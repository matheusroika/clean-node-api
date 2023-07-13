import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '@/main/config/app'
import { mongoHelper } from '@/infra/db/mongodb/helpers/mongoHelper'
import { cryptoHelper } from '@/infra/cryptography/helpers/cryptoHelper'
import { mockAddAccountParamsWithRole, mockSurveyResponseToInsert, mockSurveyToInsertOne } from '@/domain/tests'

type MakeAccessToken = {
  accessToken: string
  accountId: string
}

const makeAccessToken = async (role?: string): Promise<MakeAccessToken> => {
  const accountCollection = await mongoHelper.getCollection('accounts')
  const document = await accountCollection.insertOne(mockAddAccountParamsWithRole(role))
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
  return {
    accessToken,
    accountId: document.insertedId.toString()
  }
}

const makeSurveyId = async (accountId?: string): Promise<string> => {
  const surveyCollection = await mongoHelper.getCollection('surveys')
  const survey = await surveyCollection.insertOne(mockSurveyToInsertOne())
  const surveyId = survey.insertedId.toString()
  if (accountId) {
    const surveyResponseCollection = await mongoHelper.getCollection('surveyResponses')
    await surveyResponseCollection.insertOne(mockSurveyResponseToInsert(surveyId, accountId))
  }
  return surveyId
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
      const { accessToken } = await makeAccessToken()
      await request(app)
        .put('/api/surveys/invalid_id/response')
        .set('x-access-token', accessToken)
        .send({ answer: 'any_answer' })
        .expect(403)
    })

    test('Should return 200 on PUT /surveys/:surveyId/response with accessToken', async () => {
      const { accessToken } = await makeAccessToken()
      const surveyId = await makeSurveyId()
      await request(app)
        .put(`/api/surveys/${surveyId}/response`)
        .set('x-access-token', accessToken)
        .send({ answer: 'any_answer' })
        .expect(200)
    })
  })

  describe('Load Survey Response Route', () => {
    test('Should return 403 on GET /surveys/:surveyId/response without accessToken', async () => {
      const surveyId = await makeSurveyId()
      await request(app)
        .get(`/api/surveys/${surveyId}/response`)
        .expect(403)
    })

    test('Should return 403 on GET /surveys/:surveyId/response without valid surveyId', async () => {
      const { accessToken } = await makeAccessToken()
      await request(app)
        .get('/api/surveys/invalid_id/response')
        .set('x-access-token', accessToken)
        .expect(403)
    })

    test('Should return 200 on GET /surveys/:surveyId/response with accessToken', async () => {
      const { accessToken, accountId } = await makeAccessToken()
      const surveyId = await makeSurveyId(accountId)
      await request(app)
        .get(`/api/surveys/${surveyId}/response`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
