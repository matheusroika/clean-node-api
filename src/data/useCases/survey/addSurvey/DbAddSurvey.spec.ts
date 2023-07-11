import { DbAddSurvey } from './DbAddSurvey'
import { mockAddSurveyParams } from '@/domain/tests'
import { mockAddSurveyRepository } from '@/data/tests'
import type { AddSurveyRepository } from './DbAddSurveyProtocols'

type Sut = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): Sut => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('Db Add Survey Use Case', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyValues = mockAddSurveyParams(false)
    await sut.add(surveyValues)
    expect(addSpy).toHaveBeenCalledWith(surveyValues)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(mockAddSurveyParams(false))
    await expect(promise).rejects.toThrow()
  })
})
