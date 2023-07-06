import { mongoHelper } from '../helpers/mongoHelper'
import { SurveyResponseMongoRepository } from './SurveyResponseMongoRepository'
import type { Collection, WithId } from 'mongodb'
import type { Account } from '@/domain/models/Account'
import type { Survey } from '@/domain/models/Survey'
import type { SurveyResponse } from '@/domain/models/SurveyResponse'
import type { AccountValues } from '@/domain/useCases/AddAccount'
import type { SurveyValues } from '@/domain/useCases/AddSurvey'

type Sut = {
  sut: SurveyResponseMongoRepository
  promiseSurveyCollection: Promise<Collection>
  surveyCollection: Collection
  promiseSurveyResponseCollection: Promise<Collection>
  surveyResponseCollection: Collection
  promiseAccountCollection: Promise<Collection>
  accountCollection: Collection
}

const makeSut = async (): Promise<Sut> => {
  const sut = new SurveyResponseMongoRepository()
  const promiseSurveyCollection = mongoHelper.getCollection('surveys')
  const surveyCollection = await promiseSurveyCollection
  const promiseSurveyResponseCollection = mongoHelper.getCollection('surveyResponses')
  const surveyResponseCollection = await promiseSurveyCollection
  const promiseAccountCollection = mongoHelper.getCollection('accounts')
  const accountCollection = await promiseSurveyCollection

  return {
    sut,
    promiseSurveyCollection,
    surveyCollection,
    promiseSurveyResponseCollection,
    surveyResponseCollection,
    promiseAccountCollection,
    accountCollection
  }
}

const makeFakeSurveyValues = (): SurveyValues => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    answer: 'other_answer'
  }]
})

const makeFakeAccountValues = (): AccountValues => ({
  name: 'Any Name',
  email: 'any@email.com',
  password: 'any_password'
})

const makeSurvey = async (): Promise<Survey> => {
  const surveyCollection = await mongoHelper.getCollection('surveys')
  const document = await surveyCollection.insertOne({
    ...makeFakeSurveyValues(),
    date: new Date('2023-07-02T05:52:28.514Z')
  })
  const survey = await surveyCollection.findOne({ _id: document.insertedId }) as WithId<Document>
  return mongoHelper.map(survey)
}

const makeAccount = async (): Promise<Account> => {
  const accountCollection = await mongoHelper.getCollection('accounts')
  const document = await accountCollection.insertOne(makeFakeAccountValues())
  const account = await accountCollection.findOne({ _id: document.insertedId }) as WithId<Document>
  return mongoHelper.map(account)
}

const makeSurveyResponse = async (): Promise<SurveyResponse> => {
  const { sut } = await makeSut()
  const survey = await makeSurvey()
  const account = await makeAccount()
  const surveyResponse = await sut.save({
    surveyId: survey.id,
    accountId: account.id,
    answer: survey.answers[0].answer,
    date: new Date('2023-07-02T05:52:28.514Z')
  })
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
    const surveyCollection = await mongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('SaveSurveyResponseRepository', () => {
    test('Should add a survey response if the user hasn\'t responded yet', async () => {
      const surveyResponse = await makeSurveyResponse()
      expect(surveyResponse).toBeTruthy()
      expect(surveyResponse.id).toBeTruthy()
      expect(surveyResponse.answer).toBe('any_answer')
    })

    /* test('Should throw if surveyCollection.insertOne throws', async () => {
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
    }) */
  })
})
