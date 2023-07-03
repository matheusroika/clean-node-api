import { mongoHelper } from '../helpers/mongoHelper'
import { SurveyMongoRepository } from './SurveyMongoRepository'
import type { Collection } from 'mongodb'
import type { AddSurveyValues } from '../../../../domain/useCases/AddSurvey'

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
