import type { LoadSurveys, Survey } from './LoadSurveysControllerProtocols'
import { ok } from './LoadSurveysControllerProtocols'
import { LoadSurveysController } from './LoadSurveysController'

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<Survey[]> {
      return makeFakeSurveys()
    }
  }

  return new LoadSurveysStub()
}

interface Sut {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSut = (): Sut => {
  const loadSurveysStub = makeLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

const makeFakeSurveys = (): Survey[] => ([
  {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date('2023-07-03T05:52:28.514Z')
  }
])

describe('Load Surveys Controller', () => {
  test('Should call LoudSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(makeFakeSurveys()))
  })
})
