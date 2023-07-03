import { DbLoadSurveys } from './DbLoadSurveys'
import type { LoadSurveysRepository, Survey } from './DbLoadSurveysProtocols'

const makeLoadSurveysRepositoryStub = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadSurveys (): Promise<Survey[]> {
      return makeFakeSurveys()
    }
  }

  return new LoadSurveysRepositoryStub()
}

interface Sut {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): Sut => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepositoryStub()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return {
    sut,
    loadSurveysRepositoryStub
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

describe('Db Load Surveys', () => {
  test('Should call LoadSurveysRepository.loadSurveys', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadSurveys')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })
})