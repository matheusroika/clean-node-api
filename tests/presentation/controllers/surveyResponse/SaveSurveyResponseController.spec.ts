import { SaveSurveyResponseController } from '@/presentation/controllers/surveyResponse/SaveSurveyResponseController'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { mockLoadSurveyById, mockSaveSurveyResponse, mockSaveSurveyResponseParams, mockSurveyResponse } from '@/../tests/domain/mocks'
import type { SaveSurveyResponseControllerRequest } from '@/presentation/controllers/surveyResponse/SaveSurveyResponseController'
import type { LoadSurveyById } from '@/domain/useCases/survey/LoadSurveyById'
import type { SaveSurveyResponse } from '@/domain/useCases/surveyResponse/SaveSurveyResponse'

type Sut = {
  sut: SaveSurveyResponseController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResponseStub: SaveSurveyResponse
}

const makeSut = (): Sut => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const saveSurveyResponseStub = mockSaveSurveyResponse()
  const sut = new SaveSurveyResponseController(loadSurveyByIdStub, saveSurveyResponseStub)
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResponseStub
  }
}

const mockRequest = (): SaveSurveyResponseControllerRequest => ({
  surveyId: 'survey_id',
  answer: 'any_answer',
  accountId: 'account_id'
})

describe('Save Survey Response Controller', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2023-07-03T05:52:28.514Z'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('params.surveyId')))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    request.answer = 'invalid_answer'
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('body.answer')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call SaveSurveyResponse with correct values', async () => {
    const { sut, saveSurveyResponseStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResponseStub, 'save')
    await sut.handle(mockRequest())
    expect(saveSpy).toHaveBeenCalledWith(mockSaveSurveyResponseParams())
  })

  test('Should return 400 if no accountId is provided', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    request.accountId = undefined
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('accountId')))
  })

  test('Should return 500 if SaveSurveyResponse throws', async () => {
    const { sut, saveSurveyResponseStub } = makeSut()
    jest.spyOn(saveSurveyResponseStub, 'save').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResponse()))
  })
})
