import { mongoHelper } from '../helpers/mongoHelper'
import { SurveyMongoRepository } from './SurveyMongoRepository'
import type { Collection } from 'mongodb'
import { mockAddAccountParams, mockAddSurveyParams, mockSurveyToInsertOne, mockSurveysToInsertMany } from '@/domain/tests'

type Sut = {
  sut: SurveyMongoRepository
  promiseSurveyCollection: Promise<Collection>
  surveyCollection: Collection
  surveyResponseCollection: Collection
  accountCollection: Collection
}

const makeSut = async (): Promise<Sut> => {
  const sut = new SurveyMongoRepository()
  const promiseSurveyCollection = mongoHelper.getCollection('surveys')
  const surveyCollection = await promiseSurveyCollection
  const surveyResponseCollection = await mongoHelper.getCollection('surveyResponses')
  const accountCollection = await mongoHelper.getCollection('accounts')
  return {
    sut,
    promiseSurveyCollection,
    surveyCollection,
    surveyResponseCollection,
    accountCollection
  }
}

describe('Survey MongoDB Repository', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  beforeEach(async () => {
    const { surveyCollection, surveyResponseCollection, accountCollection } = await makeSut()
    await surveyCollection.deleteMany({})
    await surveyResponseCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('AddSurveyRepository', () => {
    test('Should add a survey on Survey.add success', async () => {
      const { sut, surveyCollection } = await makeSut()
      await sut.add(mockAddSurveyParams(false))
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
      expect(survey?.answers[0].count).toBe(0)
      expect(survey?.answers[0].percent).toBe(0)
    })

    test('Should throw if surveyCollection.insertOne throws', async () => {
      const { sut, promiseSurveyCollection, surveyCollection } = await makeSut()
      jest.spyOn(sut, 'getSurveyCollection').mockReturnValue(promiseSurveyCollection)
      jest.spyOn(surveyCollection, 'insertOne').mockImplementation(() => { throw new Error() })
      const promise = sut.add(mockAddSurveyParams(false))
      await expect(promise).rejects.toThrow()
    })

    test('Should throw if surveyCollection.findOne throws', async () => {
      const { sut, promiseSurveyCollection, surveyCollection } = await makeSut()
      jest.spyOn(sut, 'getSurveyCollection').mockReturnValue(promiseSurveyCollection)
      jest.spyOn(surveyCollection, 'findOne').mockImplementation(() => { throw new Error() })
      const promise = sut.add(mockAddSurveyParams(false))
      await expect(promise).rejects.toThrow()
    })

    test('Should throw if new survey can\'t be found on DB', async () => {
      const { sut, promiseSurveyCollection, surveyCollection } = await makeSut()
      jest.spyOn(sut, 'getSurveyCollection').mockReturnValue(promiseSurveyCollection)
      jest.spyOn(surveyCollection, 'findOne').mockResolvedValue(null)
      const promise = sut.add(mockAddSurveyParams(false))
      await expect(promise).rejects.toThrow()
    })
  })

  describe('LoadSurveysRepository', () => {
    test('Should load all surveys on success', async () => {
      const { sut, surveyCollection, accountCollection, surveyResponseCollection } = await makeSut()
      const surveys = await surveyCollection.insertMany(mockSurveysToInsertMany())
      const account = await accountCollection.insertOne(mockAddAccountParams())
      const accountId = account.insertedId
      await surveyResponseCollection.insertOne({
        surveyId: surveys.insertedIds[0],
        accountId,
        answer: 'any_answer',
        date: new Date('2023-07-02T05:12:09.514Z')
      })
      const loadedSurveys = await sut.loadSurveys(accountId.toString())
      expect(loadedSurveys.length).toBe(2)
      expect(loadedSurveys[1].id).toBeTruthy()
      expect(loadedSurveys[0].question).toBe('any_question')
      expect(loadedSurveys[1].question).toBe('other_question')
      expect(loadedSurveys[0].answered).toBe(true)
      expect(loadedSurveys[1].answered).toBe(false)
    })

    test('Should load empty array if there are no surveys', async () => {
      const { sut } = await makeSut()
      const surveys = await sut.loadSurveys('6348acd2e1a47ca32e79f46f')
      expect(surveys.length).toBe(0)
      expect(surveys).toEqual([])
    })
  })

  describe('LoadSurveyByIdRepository', () => {
    test('Should load a survey on success', async () => {
      const { sut, surveyCollection } = await makeSut()
      const document = await surveyCollection.insertOne(mockSurveyToInsertOne())
      const id = document.insertedId
      const survey = await sut.loadById(id.toString())
      expect(survey).toBeTruthy()
      expect(survey?.id).toBeTruthy()
      expect(survey?.question).toBe('any_question')
      expect(survey?.answers[1].answer).toBe('other_answer')
    })

    test('Should return null if LoadSurveyByIdRepository.loadById returns null', async () => {
      const { sut } = await makeSut()
      const survey = await sut.loadById('6348acd2e1a47ca32e79f46f')
      expect(survey).toBeNull()
    })
  })
})
