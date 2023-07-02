import { MongoHelper } from '../helpers/mongoHelper'
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
  const promiseSurveyCollection = MongoHelper.getCollection('surveys')
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
  }
  ]
})

describe('Survey MongoDB Repository', () => {
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

  test('Should add a survey on Survey.add success', async () => {
    const { sut, surveyCollection } = await makeSut()
    await sut.add(makeFakeSurveyValues())
    const survey = await surveyCollection.findOne({ question: 'any_question' })
    expect(survey).toBeTruthy()
  })

  /* test('Should throw if accountCollection.insertOne throws', async () => {
    const { sut, promiseAccountCollection, accountCollection } = await makeSut()
    jest.spyOn(sut, 'getAccountCollection').mockReturnValue(promiseAccountCollection)
    jest.spyOn(accountCollection, 'insertOne').mockImplementation(() => { throw new Error() })
    const promise = sut.add(makeFakeAccountValues())
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if accountCollection.findOne throws', async () => {
    const { sut, promiseAccountCollection, accountCollection } = await makeSut()
    jest.spyOn(sut, 'getAccountCollection').mockReturnValue(promiseAccountCollection)
    jest.spyOn(accountCollection, 'findOne').mockImplementation(() => { throw new Error() })
    const promise = sut.add(makeFakeAccountValues())
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if new account can\'t be found on DB', async () => {
    const { sut, promiseAccountCollection, accountCollection } = await makeSut()
    jest.spyOn(sut, 'getAccountCollection').mockReturnValue(promiseAccountCollection)
    jest.spyOn(accountCollection, 'findOne').mockResolvedValue(null)
    const promise = sut.add(makeFakeAccountValues())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on Account.loadByEmail success', async () => {
    const { sut } = await makeSut()
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.insertOne(makeFakeAccountValues())
    const account = await sut.loadByEmail('any@email.com') as Account
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('Any Name')
    expect(account.email).toBe('any@email.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return null if Account.loadByEmail fails', async () => {
    const { sut } = await makeSut()
    const account = await sut.loadByEmail('any@email.com')
    expect(account).toBeNull()
  })

  test('Should update the account accessToken on updateAccessToken success', async () => {
    const { sut } = await makeSut()
    const accountCollection = await MongoHelper.getCollection('accounts')
    const document = await accountCollection.insertOne(makeFakeAccountValues())
    const id = document.insertedId
    const account = await accountCollection.findOne({ _id: id })
    expect(account?.accessToken).toBeFalsy()
    await sut.updateAccessToken(id.toString(), 'any_token')
    const updatedAccount = await accountCollection.findOne({ _id: id })
    expect(updatedAccount).toBeTruthy()
    expect(updatedAccount?.accessToken).toBe('any_token')
  }) */
})
