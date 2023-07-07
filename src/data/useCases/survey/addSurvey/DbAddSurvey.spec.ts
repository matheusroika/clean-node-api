import { DbAddSurvey } from './DbAddSurvey'
import type { AddSurveyRepository, SurveyParams } from './DbAddSurveyProtocols'

type Sut = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: SurveyParams): Promise<void> {}
  }

  return new AddSurveyRepositoryStub()
}

const makeSut = (): Sut => {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

const makeFakeSurveyParams = (): SurveyParams => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})

describe('Db Add Survey Use Case', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyValues = makeFakeSurveyParams()
    await sut.add(surveyValues)
    expect(addSpy).toHaveBeenCalledWith(surveyValues)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(async () => { throw new Error() })
    const promise = sut.add(makeFakeSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
