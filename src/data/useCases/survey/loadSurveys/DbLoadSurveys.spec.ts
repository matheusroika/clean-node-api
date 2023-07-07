import { DbLoadSurveys } from './DbLoadSurveys'
import { mockSurveys } from '@/domain/tests'
import type { LoadSurveysRepository, Survey } from './DbLoadSurveysProtocols'

const makeLoadSurveysRepositoryStub = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadSurveys (): Promise<Survey[]> {
      return mockSurveys()
    }
  }
  return new LoadSurveysRepositoryStub()
}

type Sut = {
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

describe('Db Load Surveys', () => {
  test('Should call LoadSurveysRepository.loadSurveys', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadSurveys')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(mockSurveys())
  })

  test('Should throw if LoadSurveysRepository.loadSurveys throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadSurveys').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
