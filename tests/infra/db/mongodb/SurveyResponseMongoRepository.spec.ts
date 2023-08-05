import { ObjectId } from 'mongodb'
import { mongoHelper } from '@/infra/db/mongodb/mongoHelper'
import { SurveyResponseMongoRepository } from '@/infra/db/mongodb/SurveyResponseMongoRepository'
import { mockAddAccountParams, mockSaveSurveyResponseParams, mockSurveyToInsertOne } from '@/../tests/domain/mocks'
import type { Collection, WithId } from 'mongodb'
import type { Account } from '@/domain/models/Account'
import type { Survey } from '@/domain/models/Survey'
import type { SurveyResponse } from '@/domain/models/SurveyResponse'

type Sut = {
  sut: SurveyResponseMongoRepository
  promiseSurveyResponseCollection: Promise<Collection>
  promiseSurveyCollection: Promise<Collection>
  surveyResponseCollection: Collection
  surveyCollection: Collection
}

const makeSut = async (): Promise<Sut> => {
  const sut = new SurveyResponseMongoRepository()
  const promiseSurveyResponseCollection = mongoHelper.getCollection('surveyResponses')
  const promiseSurveyCollection = mongoHelper.getCollection('surveys')
  const surveyResponseCollection = await promiseSurveyResponseCollection
  const surveyCollection = await promiseSurveyCollection
  return {
    sut,
    promiseSurveyResponseCollection,
    promiseSurveyCollection,
    surveyResponseCollection,
    surveyCollection
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

const getSurvey = async (surveyId: string): Promise<Survey> => {
  const surveyCollection = await mongoHelper.getCollection('surveys')
  const survey = await surveyCollection.findOne({ _id: new ObjectId(surveyId) }) as WithId<Document>
  return mongoHelper.map(survey)
}

const insertSurveyResponse = async (survey: Survey, account: Account): Promise<SurveyResponse> => {
  const { sut } = await makeSut()
  const surveyResponse = await sut.save({
    surveyId: survey.id,
    accountId: account.id,
    answer: survey.answers[1].answer
  })
  return surveyResponse
}

type MakeSurveyResponse = {
  surveyResponse: SurveyResponse
  previousResponseId: ObjectId | null
}

const makeSurveyResponse = async (update?: boolean, existingSurvey?: Survey): Promise<MakeSurveyResponse> => {
  const { sut } = await makeSut()
  const survey = existingSurvey ?? await makeSurvey()
  const account = await makeAccount()
  const previousSurveyResponse = update ? await insertSurveyResponse(survey, account) : null
  const surveyResponse = await sut.save({
    surveyId: survey.id.toString(),
    accountId: account.id.toString(),
    answer: survey.answers[0].answer
  })
  return {
    surveyResponse,
    previousResponseId: new ObjectId(previousSurveyResponse?.id)
  }
}

const makeOneSurveyResponse = async (existingSurvey?: Survey): Promise<SurveyResponse> => {
  const survey = existingSurvey ?? await makeSurvey()
  const account = await makeAccount()
  const surveyResponse = await insertSurveyResponse(survey, account)
  return surveyResponse
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
      const { surveyResponse } = await makeSurveyResponse()
      const survey = await getSurvey(surveyResponse.survey.id.toString())
      const answer = survey.answers.find(item => item.answer === surveyResponse.answer)
      expect(surveyResponse).toBeTruthy()
      expect(surveyResponse.survey.id).toEqual(survey.id)
      expect(surveyResponse.answer).toBe(answer?.answer)
      expect(answer?.count).toBe(1)
      expect(answer?.percent).toBe(100)
    })

    test('Should update the survey response if user has responded already', async () => {
      const { surveyResponse, previousResponseId } = await makeSurveyResponse(true)
      const survey = await getSurvey(surveyResponse.survey.id)
      const answer = survey.answers.find(item => item.answer === surveyResponse.answer)
      expect(surveyResponse).toBeTruthy()
      expect(surveyResponse.id).toEqual(previousResponseId)
      expect(surveyResponse.answer).toBe(answer?.answer)
      expect(answer?.count).toBe(1)
      expect(answer?.percent).toBe(100)
    })

    test('Should update answer count correctly', async () => {
      const { surveyResponse } = await makeSurveyResponse()
      let survey = await getSurvey(surveyResponse.survey.id)
      let answer = survey.answers.find(item => item.answer === surveyResponse.answer)
      expect(answer?.count).toBe(1)
      await makeSurveyResponse(false, survey)
      survey = await getSurvey(survey.id)
      answer = survey.answers.find(item => item.answer === surveyResponse.answer)
      expect(answer?.count).toBe(2)
    })

    test('Should update answer percent correctly', async () => {
      const surveyResponse = await makeOneSurveyResponse()
      let survey = await getSurvey(surveyResponse.survey.id)
      let answer = survey.answers.find(item => item.answer === surveyResponse.answer)
      expect(answer?.percent).toBe(100)
      await makeSurveyResponse(false, survey)
      survey = await getSurvey(survey.id)
      answer = survey.answers.find(item => item.answer === surveyResponse.answer)
      expect(answer?.percent).toBe(50)
    })

    test('Should throw if surveyResponseCollection.findOneAndUpdate throws', async () => {
      const { sut, promiseSurveyResponseCollection, surveyResponseCollection } = await makeSut()
      jest.spyOn(sut, 'getSurveyResponseCollection').mockReturnValue(promiseSurveyResponseCollection)
      jest.spyOn(surveyResponseCollection, 'findOneAndUpdate').mockImplementation(() => { throw new Error() })
      const promise = sut.save(mockSaveSurveyResponseParams())
      await expect(promise).rejects.toThrow()
    })

    test('Should throw if surveyResponseCollection.findOne throws', async () => {
      const { sut, promiseSurveyResponseCollection, surveyResponseCollection } = await makeSut()
      jest.spyOn(sut, 'getSurveyResponseCollection').mockReturnValue(promiseSurveyResponseCollection)
      jest.spyOn(surveyResponseCollection, 'findOne').mockImplementation(() => { throw new Error() })
      const promise = sut.save(mockSaveSurveyResponseParams())
      await expect(promise).rejects.toThrow()
    })

    test('Should throw if surveyCollection.findOneAndUpdate throws', async () => {
      const { sut, promiseSurveyCollection, surveyCollection } = await makeSut()
      jest.spyOn(sut, 'getSurveyCollection').mockReturnValue(promiseSurveyCollection)
      jest.spyOn(surveyCollection, 'findOneAndUpdate').mockImplementation(() => { throw new Error() })
      const promise = sut.save(mockSaveSurveyResponseParams())
      await expect(promise).rejects.toThrow()
    })
  })

  describe('LoadSurveyResponseRepository', () => {
    test('Should load survey response correctly', async () => {
      const { surveyResponse } = await makeSurveyResponse()
      const { sut } = await makeSut()
      const loadSurveyResponse = await sut.load({
        surveyId: surveyResponse.survey.id,
        accountId: surveyResponse.accountId
      })
      expect(loadSurveyResponse).toEqual(surveyResponse)
    })

    test('Should return correctly if survey exists but account hasn\'t responded', async () => {
      const survey = await makeSurvey()
      const { sut } = await makeSut()
      const loadSurveyResponse = await sut.load({
        surveyId: survey.id,
        accountId: '6348acd2e1a47ca32e79f46f'
      })
      const answers = survey.answers.map(answer => ({ ...answer, isCurrentAccountAnswer: false }))
      survey.answers = answers
      expect(loadSurveyResponse).toEqual({
        id: loadSurveyResponse?.id,
        accountId: new ObjectId('6348acd2e1a47ca32e79f46f'),
        answer: null,
        date: null,
        survey: { ...survey, answered: false }
      })
    })

    test('Should return null if can\'t find survey response', async () => {
      const { sut } = await makeSut()
      const loadSurveyResponse = await sut.load({
        surveyId: '6348acd2e1a47ca32e79f46f',
        accountId: '6348acd2e1a47ca32e79f46f'
      })
      expect(loadSurveyResponse).toBeNull()
    })
  })
})
