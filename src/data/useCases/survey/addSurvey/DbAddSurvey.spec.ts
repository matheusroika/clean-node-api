import { DbAddSurvey } from './DbAddSurvey'
import type { AddSurveyRepository, AddSurveyParams } from './DbAddSurveyProtocols'

type Sut = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyParams): Promise<void> {}
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

const makeFakeAddSurveyParams = (): AddSurveyParams => ({
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
    const surveyValues = makeFakeAddSurveyParams()
    await sut.add(surveyValues)
    expect(addSpy).toHaveBeenCalledWith(surveyValues)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(makeFakeAddSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
