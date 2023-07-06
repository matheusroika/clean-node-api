import { DbSaveSurveyResponse } from './DbSaveSurveyResponse'
import type { SaveSurveyResponseRepository, SurveyResponse, SurveyResponseData } from './DbSaveSurveyResponseProtocols'

type Sut = {
  sut: DbSaveSurveyResponse
  saveSurveyResponseRepositoryStub: SaveSurveyResponseRepository
}

const makeSaveSurveyResponseRepository = (): SaveSurveyResponseRepository => {
  class SaveSurveyResponseRepositoryStub implements SaveSurveyResponseRepository {
    async save (data: SurveyResponseData): Promise<SurveyResponse> {
      return makeFakeSurveyResponse()
    }
  }

  return new SaveSurveyResponseRepositoryStub()
}

const makeSut = (): Sut => {
  const saveSurveyResponseRepositoryStub = makeSaveSurveyResponseRepository()
  const sut = new DbSaveSurveyResponse(saveSurveyResponseRepositoryStub)
  return {
    sut,
    saveSurveyResponseRepositoryStub
  }
}

const makeFakeSurveyResponseData = (): SurveyResponseData => ({
  surveyId: 'survey_id',
  accountId: 'account_id',
  answer: 'any_answer',
  date: new Date('2023-07-03T05:52:28.514Z')
})

const makeFakeSurveyResponse = (): SurveyResponse => ({
  id: 'any_id',
  ...makeFakeSurveyResponseData()
})

describe('Db Save Survey Response Use Case', () => {
  test('Should call SaveSurveyResponseRepository.saveSurveyResponse with correct values', async () => {
    const { sut, saveSurveyResponseRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResponseRepositoryStub, 'save')
    const surveyResponseData = makeFakeSurveyResponseData()
    await sut.save(surveyResponseData)
    expect(saveSpy).toHaveBeenCalledWith(surveyResponseData)
  })

  test('Should return a SurveyResponse on success', async () => {
    const { sut } = makeSut()
    const surveyResponse = await sut.save(makeFakeSurveyResponseData())
    expect(surveyResponse).toEqual(makeFakeSurveyResponse())
  })

  test('Should throw if SaveSurveyResponseRepository.saveSurveyResponse throws', async () => {
    const { sut, saveSurveyResponseRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResponseRepositoryStub, 'save').mockImplementationOnce(async () => { throw new Error() })
    const promise = sut.save(makeFakeSurveyResponseData())
    await expect(promise).rejects.toThrow()
  })
})
