import { DbLoadSurveyResponse } from './DbLoadSurveyResponse'
import { mockSurveyResponse } from './DbLoadSurveyResponseProtocols'
import type { LoadSurveyResponseRepository, SurveyResponse } from './DbLoadSurveyResponseProtocols'

const makeLoadSurveyResponseRepository = (): LoadSurveyResponseRepository => {
  class LoadSurveyResponseRepositoryStub implements LoadSurveyResponseRepository {
    async loadBySurveyId (surveyId: string): Promise<SurveyResponse> {
      return mockSurveyResponse()
    }
  }
  return new LoadSurveyResponseRepositoryStub()
}

type Sut = {
  sut: DbLoadSurveyResponse
  loadSurveyResponseRepositoryStub: LoadSurveyResponseRepository
}

const makeSut = (): Sut => {
  const loadSurveyResponseRepositoryStub = makeLoadSurveyResponseRepository()
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