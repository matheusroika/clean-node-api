import request from 'supertest'
import app from '@/main/config/app'
import { mongoHelper } from '@/infra/db/mongodb/helpers/mongoHelper'

describe('Survey Response Routes', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  describe('Save Survey Response Route', () => {
    test('Should return 403 on PUT /surveys/:surveyId/response without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/response')
        .send({ answer: 'any_answer' })
        .expect(403)
    })
  })
})
