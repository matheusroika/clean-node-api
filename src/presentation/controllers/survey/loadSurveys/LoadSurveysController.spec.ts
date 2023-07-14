import { LoadSurveysController } from './LoadSurveysController'
import { noContent, ok, serverError } from './LoadSurveysControllerProtocols'
import { mockLoadSurveys, mockSurveys } from '@/domain/tests'
import type { LoadSurveys, HttpRequest } from './LoadSurveysControllerProtocols'

type Sut = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSut = (): Sut => {
  const loadSurveysStub = mockLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

const mockRequest = (): HttpRequest => ({
  accountId: 'account_id'
})

describe('Load Surveys Controller', () => {
  test('Should call LoudSurveys with correct value', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith(httpRequest.accountId)
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockSurveys()))
  })

  test('Should return 204 if LoadSurveys returns an empty array', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockResolvedValueOnce([])
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoudSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
