import { mongoHelper } from '../helpers/mongoHelper'
import { SurveyResponseMongoRepository } from './SurveyResponseMongoRepository'
import { mockAddAccountParams, mockSurveyToInsertOne } from '@/domain/tests'
import { ObjectId } from 'mongodb'
import type { Collection, WithId } from 'mongodb'
import type { Account } from '@/domain/models/Account'
import type { Survey } from '@/domain/models/Survey'
import type { SurveyResponse } from '@/domain/models/SurveyResponse'

type Sut = {
  sut: SurveyResponseMongoRepository
  promiseSurveyResponseCollection: Promise<Collection>
  surveyResponseCollection: Collection
}

const makeSut = async (): Promise<Sut> => {
  const sut = new SurveyResponseMongoRepository()
  const promiseSurveyResponseCollection = mongoHelper.getCollection('surveyResponses')
  const surveyResponseCollection = await promiseSurveyResponseCollection
  return {
    sut,
    promiseSurveyResponseCollection,
    surveyResponseCollection
  }
}

const makeSurvey = async (): Promise<Survey> => {
  const surveyCollection = await mongoHelper.getCollection('surveys')
  const document = await surveyCollection.insertOne(mockSurveyToInsertOne())
  const survey = await surveyCollection.findOne({ _id: document.insertedId }) as WithId<Document>
  return mongoHelper.map(survey)
}

const makeAccount = async (): Promise<Account> => {
  const accountCollection = await mongoHelper.getCollection('accounts')
  const document = await accountCollection.insertOne(mockAddAccountParams())
  const account = await accountCollection.findOne({ _id: document.insertedId }) as WithId<Document>
  return mongoHelper.map(account)
}

const insertSurveyResponse = async (survey: Survey, account: Account): Promise<ObjectId> => {
  const surveyResponseCollection = await mongoHelper.getCollection('surveyResponses')
  const document = await surveyResponseCollection.insertOne({
    surveyId: new ObjectId(survey.id),
    accountId: new ObjectId(account.id),
    answer: survey.answers[1].answer,
    date: new Date('2023-07-02T05:52:28.514Z')
  })
  return document.insertedId
}

type MakeSurveyResponse = {
  surveyResponse: SurveyResponse
  surveyId: string
  previousResponseId: ObjectId | null
}

const makeSurveyResponse = async (update: boolean): Promise<MakeSurveyResponse> => {
  const { sut } = await makeSut()
  const survey = await makeSurvey()
  const account = await makeAccount()
  const previousResponseId = update ? await insertSurveyResponse(survey, account) : null
  const surveyResponse = await sut.save({
    surveyId: survey.id,
    accountId: account.id,
    answer: survey.answers[0].answer
  })
  return {
    surveyResponse,
    surveyId: survey.id,
    previousResponseId
  }
}

describe('Survey Response MongoDB Repository', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  beforeEach(async () => {
    const surveyResponseCollection = await mongoHelper.getCollection('surveyResponses')
    await surveyResponseCollection.deleteMany({})
  })

  describe('SaveSurveyResponseRepository', () => {
    test('Should add a survey response if the user hasn\'t responded yet', async () => {
      const { surveyResponse, surveyId } = await makeSurveyResponse(false)
      expect(surveyResponse).toBeTruthy()
      expect(surveyResponse.surveyId).toEqual(surveyId)
    })

    test('Should update the survey response if user has responded already', async () => {
      const { surveyResponse, previousResponseId } = await makeSurveyResponse(true)
      expect(surveyResponse).toBeTruthy()
      expect(surveyResponse.id).toEqual(previousResponseId)
    })

    test('Should throw if surveyResponseCollection.findOneAndUpdate throws', async () => {
      const { sut, promiseSurveyResponseCollection, surveyResponseCollection } = await makeSut()
      jest.spyOn(sut, 'getSurveyResponseCollection').mockReturnValue(promiseSurveyResponseCollection)
      jest.spyOn(surveyResponseCollection, 'findOneAndUpdate').mockImplementation(() => { throw new Error() })
      const promise = sut.save({
        accountId: 'account_id',
        surveyId: 'survey_id',
        answer: 'any_answer'
      })
      await expect(promise).rejects.toThrow()
    })
  })
})
