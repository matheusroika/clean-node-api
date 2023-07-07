import { SaveSurveyResponseController } from './SaveSurveyResponseController'
import { mockSurvey } from '@/domain/tests'
import { badRequest, forbidden, InvalidParamError, MissingParamError, ok, serverError } from './SaveSurveyResponseControllerProtocols'
import type { HttpRequest, LoadSurveyById, Survey, SurveyResponse, SaveSurveyResponseParams, SaveSurveyResponse } from './SaveSurveyResponseControllerProtocols'

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<Survey | null> {
      return mockSurvey()
    }
  }

  return new LoadSurveyByIdStub()
}

const makeSaveSurveyResponse = (): SaveSurveyResponse => {
  class SaveSurveyResponseStub implements SaveSurveyResponse {
    async save (data: SaveSurveyResponseParams): Promise<SurveyResponse> {
      return makeFakeSurveyResponse()
    }
  }

  return new SaveSurveyResponseStub()
}

type Sut = {
  sut: SaveSurveyResponseController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResponseStub: SaveSurveyResponse
}

const makeSut = (): Sut => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const saveSurveyResponseStub = makeSaveSurveyResponse()
  const sut = new SaveSurveyResponseController(loadSurveyByIdStub, saveSurveyResponseStub)
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResponseStub
  }
}

const makeFakeSaveSurveyResponseParams = (): SaveSurveyResponseParams => ({
  surveyId: 'survey_id',
  accountId: 'account_id',
  answer: 'any_answer',
  date: new Date('2023-07-03T05:52:28.514Z')
})

const makeFakeSurveyResponse = (): SurveyResponse => ({
  id: 'any_id',
  ...makeFakeSaveSurveyResponseParams()
})

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'survey_id'
  },
  body: {
    answer: 'any_answer'
  },
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
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('params.surveyId')))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const fakeRequest = makeFakeRequest()
    fakeRequest.body.answer = 'invalid_answer'
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('body.answer')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call SaveSurveyResponse with correct values', async () => {
    const { sut, saveSurveyResponseStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResponseStub, 'save')
    await sut.handle(makeFakeRequest())
    expect(saveSpy).toHaveBeenCalledWith(makeFakeSaveSurveyResponseParams())
  })

  test('Should return 400 if no accountId is provided', async () => {
    const { sut } = makeSut()
    const fakeRequest = makeFakeRequest()
    fakeRequest.accountId = undefined
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('accountId')))
  })

  test('Should return 500 if SaveSurveyResponse throws', async () => {
    const { sut, saveSurveyResponseStub } = makeSut()
    jest.spyOn(saveSurveyResponseStub, 'save').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeSurveyResponse()))
  })
})
