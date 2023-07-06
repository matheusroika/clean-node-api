import { SaveSurveyResponseController } from './SaveSurveyResponseController'
import { forbidden, InvalidParamError } from './SaveSurveyResponseControllerProtocols'
import type { HttpRequest, LoadSurveyById, Survey } from './SaveSurveyResponseControllerProtocols'

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<Survey | null> {
      return makeFakeSurvey()
    }
  }

  return new LoadSurveyByIdStub()
}

type Sut = {
  sut: SaveSurveyResponseController
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): Sut => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResponseController(loadSurveyByIdStub)
  return {
    sut,
    loadSurveyByIdStub
  }
}

const makeFakeSurvey = (): Survey => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer'
  }],
  date: new Date('2023-07-03T05:52:28.514Z')
})

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

describe('Save Survey Response Controller', () => {
  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('params.surveyId')))
  })
})
