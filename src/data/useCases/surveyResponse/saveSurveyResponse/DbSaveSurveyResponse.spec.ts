import { DbSaveSurveyResponse } from './DbSaveSurveyResponse'
import { mockSaveSurveyResponseParams, mockSurveyResponse } from '@/domain/tests'
import { mockSaveSurveyResponseRepository } from '@/data/tests'
import type { SaveSurveyResponseRepository } from './DbSaveSurveyResponseProtocols'

type Sut = {
  sut: DbSaveSurveyResponse
  saveSurveyResponseRepositoryStub: SaveSurveyResponseRepository
}

const makeSut = (): Sut => {
  const saveSurveyResponseRepositoryStub = mockSaveSurveyResponseRepository()
  const sut = new DbSaveSurveyResponse(saveSurveyResponseRepositoryStub)
  return {
    sut,
    saveSurveyResponseRepositoryStub
  }
}

describe('Db Save Survey Response Use Case', () => {
  test('Should call SaveSurveyResponseRepository.saveSurveyResponse with correct values', async () => {
    const { sut, saveSurveyResponseRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResponseRepositoryStub, 'save')
    const surveyResponseData = mockSaveSurveyResponseParams()
    await sut.save(surveyResponseData)
    expect(saveSpy).toHaveBeenCalledWith(surveyResponseData)
  })

  test('Should return a SurveyResponse on success', async () => {
    const { sut } = makeSut()
    const surveyResponse = await sut.save(mockSaveSurveyResponseParams())
    expect(surveyResponse).toEqual(mockSurveyResponse())
  })

  test('Should throw if SaveSurveyResponseRepository.saveSurveyResponse throws', async () => {
    const { sut, saveSurveyResponseRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResponseRepositoryStub, 'save').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.save(mockSaveSurveyResponseParams())
    await expect(promise).rejects.toThrow()
  })
})
