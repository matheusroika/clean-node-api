import { LoadSurveyResponseController } from '@/presentation/controllers/surveyResponse/LoadSurveyResponseController'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { mockLoadSurveyResponse, mockLoadSurveyResponseParams, mockSurveyResponse } from '@/../tests/domain/mocks'
import type { LoadSurveyResponseControllerRequest } from '@/presentation/controllers/surveyResponse/LoadSurveyResponseController'
import type { LoadSurveyResponse } from '@/domain/useCases/surveyResponse/LoadSurveyResponse'

type Sut = {
  sut: LoadSurveyResponseController
  loadSurveyResponseStub: LoadSurveyResponse
}

const makeSut = (): Sut => {
  const loadSurveyResponseStub = mockLoadSurveyResponse()
  const sut = new LoadSurveyResponseController(loadSurveyResponseStub)
  return {
    sut,
    loadSurveyResponseStub
  }
}

const mockRequest = (): LoadSurveyResponseControllerRequest => ({
  surveyId: 'survey_id',
  accountId: 'account_id'
})

describe('Load Survey Response Controller', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2023-07-03T05:52:28.514Z'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('Should call loadSurveyResponse.load with correct values', async () => {
    const { sut, loadSurveyResponseStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResponseStub, 'load')
    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith(mockLoadSurveyResponseParams())
  })

  test('Should return 403 if loadSurveyResponse.load returns null', async () => {
    const { sut, loadSurveyResponseStub } = makeSut()
    jest.spyOn(loadSurveyResponseStub, 'load').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('params.surveyId')))
  })

  test('Should return 500 if loadSurveyResponse.load throws', async () => {
    const { sut, loadSurveyResponseStub } = makeSut()
    jest.spyOn(loadSurveyResponseStub, 'load').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 400 if no accountId is provided', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    request.accountId = undefined
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('accountId')))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResponse()))
  })
})
