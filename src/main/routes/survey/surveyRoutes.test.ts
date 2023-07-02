import request from 'supertest'
import app from '../../config/app'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongoHelper'

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('Surveys Route', () => {
    test('Should return 204 on POST /survey success', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image.com/image.png'
          }, {
            answer: 'Answer 2'
          }]
        })
        .expect(204)
    })
  })
})
