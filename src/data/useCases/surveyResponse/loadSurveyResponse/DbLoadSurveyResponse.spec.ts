import { DbLoadSurveyResponse } from './DbLoadSurveyResponse'
import { mockLoadSurveyResponseRepository, mockSurveyResponse } from './DbLoadSurveyResponseProtocols'
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
  test('Should call LoadSurveyResponseRepository.loadBySurveyId with correct id', async () => {
    const { sut, loadSurveyResponseRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResponseRepositoryStub, 'loadBySurveyId')
    await sut.load('survey_id')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('survey_id')
  })

  test('Should return a SurveyResponse on success', async () => {
    const { sut } = makeSut()
    const surveyResponse = await sut.load('survey_id')
    expect(surveyResponse).toEqual(mockSurveyResponse())
  })

  test('Should throw if LoadSurveyResponseRepository.loadBySurveyId throws', async () => {
    const { sut, loadSurveyResponseRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResponseRepositoryStub, 'loadBySurveyId').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.load('survey_id')
    await expect(promise).rejects.toThrow()
  })
})
