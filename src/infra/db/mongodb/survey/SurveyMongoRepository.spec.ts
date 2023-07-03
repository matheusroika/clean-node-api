import { mongoHelper } from '../helpers/mongoHelper'
import { SurveyMongoRepository } from './SurveyMongoRepository'
import type { Collection } from 'mongodb'
import type { AddSurveyValues } from '../../../../domain/useCases/AddSurvey'
import type { Survey } from '../../../../domain/models/Survey'

interface Sut {
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

const makeFakeSurveyValues = (): AddSurveyValues => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    answer: 'other_answer'
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
      await sut.add(makeFakeSurveyValues())
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })

    test('Should throw if surveyCollection.insertOne throws', async () => {
      const { sut, promiseSurveyCollection, surveyCollection } = await makeSut()
      jest.spyOn(sut, 'getSurveyCollection').mockReturnValue(promiseSurveyCollection)
      jest.spyOn(surveyCollection, 'insertOne').mockImplementation(() => { throw new Error() })
      const promise = sut.add(makeFakeSurveyValues())
      await expect(promise).rejects.toThrow()
    })

    test('Should throw if surveyCollection.findOne throws', async () => {
      const { sut, promiseSurveyCollection, surveyCollection } = await makeSut()
      jest.spyOn(sut, 'getSurveyCollection').mockReturnValue(promiseSurveyCollection)
      jest.spyOn(surveyCollection, 'findOne').mockImplementation(() => { throw new Error() })
      const promise = sut.add(makeFakeSurveyValues())
      await expect(promise).rejects.toThrow()
    })

    test('Should throw if new survey can\'t be found on DB', async () => {
      const { sut, promiseSurveyCollection, surveyCollection } = await makeSut()
      jest.spyOn(sut, 'getSurveyCollection').mockReturnValue(promiseSurveyCollection)
      jest.spyOn(surveyCollection, 'findOne').mockResolvedValue(null)
      const promise = sut.add(makeFakeSurveyValues())
      await expect(promise).rejects.toThrow()
    })
  })

  describe('LoadSurveysRepository', () => {
    test('Should load all surveys on success', async () => {
      const { sut, surveyCollection } = await makeSut()
      await surveyCollection.insertMany(makeFakeSurveys())
      const surveys = await sut.loadSurveys()
      expect(surveys.length).toBe(2)
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
})
