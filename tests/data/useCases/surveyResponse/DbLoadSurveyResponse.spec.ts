import { DbLoadSurveyResponse } from '@/data/useCases/surveyResponse/DbLoadSurveyResponse'
import { mockLoadSurveyResponseParams, mockSurveyResponse } from '@/../tests/domain/mocks'
import { mockLoadSurveyResponseRepository } from '@/../tests/data/mocks'
import type { LoadSurveyResponseRepository } from '@/data/protocols/db/surveyResponse/LoadSurveyResponseRepository'

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
  test('Should call LoadSurveyResponseRepository.load with correct id', async () => {
    const { sut, loadSurveyResponseRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResponseRepositoryStub, 'load')
    await sut.load(mockLoadSurveyResponseParams())
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(mockLoadSurveyResponseParams())
  })

  test('Should return null if LoadSurveyResponseRepository.load returns null', async () => {
    const { sut, loadSurveyResponseRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResponseRepositoryStub, 'load').mockResolvedValueOnce(null)
    const surveyResponse = await sut.load(mockLoadSurveyResponseParams())
    expect(surveyResponse).toBeNull()
  })

  test('Should return a SurveyResponse on success', async () => {
    const { sut } = makeSut()
    const surveyResponse = await sut.load(mockLoadSurveyResponseParams())
    expect(surveyResponse).toEqual(mockSurveyResponse())
  })

  test('Should throw if LoadSurveyResponseRepository.load throws', async () => {
    const { sut, loadSurveyResponseRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResponseRepositoryStub, 'load').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.load(mockLoadSurveyResponseParams())
    await expect(promise).rejects.toThrow()
  })
})
