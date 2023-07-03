import type { LoadSurveys, Survey } from './LoadSurveysControllerProtocols'
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
    date: new Date()
  }
])

describe('Load Surveys Controller', () => {
  test('Should call LoudSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
})
