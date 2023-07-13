import { DbLoadSurveyResponse } from './DbLoadSurveyResponse'
import { mockLoadSurveyResponseRepository } from './DbLoadSurveyResponseProtocols'
import type { LoadSurveyResponseRepository } from './DbLoadSurveyResponseProtocols'

type Sut = {
  sut: DbLoadSurveyResponse
  loadSurveyResponseRepositoryStub: LoadSurveyResponseRepository
}

const makeSut = (): Sut => {
  const loadSurveyResponseRepositoryStub = mockLoadSurveyResponseRepository()
  const sut = new DbLoadSurveyResponse(loadSurveyResponseRepositoryStub)
  return {
    sut,
    loadSurveyResponseRepositoryStub
  }
}

describe('Db Load Survey Response Use Case', () => {
  test('Should call LoadSurveyResponseRepository with correct id', async () => {
    const { sut, loadSurveyResponseRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResponseRepositoryStub, 'loadBySurveyId')
    await sut.load('survey_id')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('survey_id')
  })
})
