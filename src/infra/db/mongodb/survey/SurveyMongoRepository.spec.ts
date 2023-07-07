import { mongoHelper } from '../helpers/mongoHelper'
import { SurveyMongoRepository } from './SurveyMongoRepository'
import type { Collection } from 'mongodb'
import { mockAddSurveyParams, mockSurveyToInsertOne, mockSurveysToInsertMany } from '@/domain/tests'

type Sut = {
  sut: SurveyMongoRepository
  promiseSurveyCollection: Promise<Collection>
  surveyCollection: Collection
}

const makeSut = async (): Promise<Sut> => {
  const sut = new SurveyMongoRepository()
  const promiseSurveyCollection = mongoHelper.getCollection('surveys')
  const surveyCollection = await promiseSurveyCollection
  return {
    sut,
    promiseSurveyCollection,
    surveyCollection
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
    const surveyCollection = await mongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('AddSurveyRepository', () => {
    test('Should add a survey on Survey.add success', async () => {
      const { sut, surveyCollection } = await makeSut()
      await sut.add(mockAddSurveyParams())
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })

    test('Should throw if surveyCollection.insertOne throws', async () => {
      const { sut, promiseSurveyCollection, surveyCollection } = await makeSut()
      jest.spyOn(sut, 'getSurveyCollection').mockReturnValue(promiseSurveyCollection)
      jest.spyOn(surveyCollection, 'insertOne').mockImplementation(() => { throw new Error() })
      const promise = sut.add(mockAddSurveyParams())
      await expect(promise).rejects.toThrow()
    })

    test('Should throw if surveyCollection.findOne throws', async () => {
      const { sut, promiseSurveyCollection, surveyCollection } = await makeSut()
      jest.spyOn(sut, 'getSurveyCollection').mockReturnValue(promiseSurveyCollection)
      jest.spyOn(surveyCollection, 'findOne').mockImplementation(() => { throw new Error() })
      const promise = sut.add(mockAddSurveyParams())
      await expect(promise).rejects.toThrow()
    })

    test('Should throw if new survey can\'t be found on DB', async () => {
      const { sut, promiseSurveyCollection, surveyCollection } = await makeSut()
      jest.spyOn(sut, 'getSurveyCollection').mockReturnValue(promiseSurveyCollection)
      jest.spyOn(surveyCollection, 'findOne').mockResolvedValue(null)
      const promise = sut.add(mockAddSurveyParams())
      await expect(promise).rejects.toThrow()
    })
  })

  describe('LoadSurveysRepository', () => {
    test('Should load all surveys on success', async () => {
      const { sut, surveyCollection } = await makeSut()
      await surveyCollection.insertMany(mockSurveysToInsertMany())
      const surveys = await sut.loadSurveys()
      expect(surveys.length).toBe(2)
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })

    test('Should load empty array if there are no surveys', async () => {
      const { sut } = await makeSut()
      const surveys = await sut.loadSurveys()
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
