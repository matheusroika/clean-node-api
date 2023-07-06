import { SaveSurveyResponseController } from './SaveSurveyResponseController'
import { forbidden, InvalidParamError, serverError } from './SaveSurveyResponseControllerProtocols'
import type { HttpRequest, LoadSurveyById, Survey, SurveyResponse, SurveyResponseData, SaveSurveyResponse } from './SaveSurveyResponseControllerProtocols'

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<Survey | null> {
      return makeFakeSurvey()
    }
  }

  return new LoadSurveyByIdStub()
}

const makeSaveSurveyResponse = (): SaveSurveyResponse => {
  class SaveSurveyResponseStub implements SaveSurveyResponse {
    async save (data: SurveyResponseData): Promise<SurveyResponse> {
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

const makeFakeSurvey = (): Survey => ({
  id: 'survey_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer'
  }],
  date: new Date('2023-07-03T05:52:28.514Z')
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
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(async () => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call SaveSurveyResponse with correct values', async () => {
    const { sut, saveSurveyResponseStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResponseStub, 'save')
    await sut.handle(makeFakeRequest())
    expect(saveSpy).toHaveBeenCalledWith(makeFakeSurveyResponseData())
  })

  test('Should return 500 if SaveSurveyResponse throws', async () => {
    const { sut, saveSurveyResponseStub } = makeSut()
    jest.spyOn(saveSurveyResponseStub, 'save').mockImplementationOnce(async () => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
