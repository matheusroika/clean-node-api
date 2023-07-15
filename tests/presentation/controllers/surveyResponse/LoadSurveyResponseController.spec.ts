import { LoadSurveyResponseController } from '@/presentation/controllers/surveyResponse/LoadSurveyResponseController'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { mockLoadSurveyResponse, mockLoadSurveyResponseParams, mockSurveyResponse } from '@/../tests/domain/mocks'
import type { LoadSurveyResponse } from '@/domain/useCases/surveyResponse/LoadSurveyResponse'
import type { HttpRequest } from '@/presentation/protocols'

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

const mockHttpRequest = (): HttpRequest => ({
  params: {
    surveyId: 'survey_id'
  },
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
    await sut.handle(mockHttpRequest())
    expect(loadSpy).toHaveBeenCalledWith(mockLoadSurveyResponseParams())
  })

  test('Should return 403 if loadSurveyResponse.load returns null', async () => {
    const { sut, loadSurveyResponseStub } = makeSut()
    jest.spyOn(loadSurveyResponseStub, 'load').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('params.surveyId')))
  })

  test('Should return 500 if loadSurveyResponse.load throws', async () => {
    const { sut, loadSurveyResponseStub } = makeSut()
    jest.spyOn(loadSurveyResponseStub, 'load').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 400 if no accountId is provided', async () => {
    const { sut } = makeSut()
    const fakeRequest = mockHttpRequest()
    fakeRequest.accountId = undefined
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('accountId')))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResponse()))
  })
})
