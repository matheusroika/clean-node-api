import { DbLoadSurveys } from './DbLoadSurveys'
import { mockSurveys } from '@/domain/tests'
import { mockLoadSurveysRepositoryStub } from '@/data/tests'
import type { LoadSurveysRepository } from './DbLoadSurveysProtocols'

type Sut = {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): Sut => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepositoryStub()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return {
    sut,
    loadSurveysRepositoryStub
  }
}

const mockAccountId = (): string => 'account_id'

describe('Db Load Surveys', () => {
  test('Should call LoadSurveysRepository.loadSurveys with correct value', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadSurveys')
    await sut.load(mockAccountId())
    expect(loadSpy).toHaveBeenCalledWith(mockAccountId())
  })

  test('Should return surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load(mockAccountId())
    expect(surveys).toEqual(mockSurveys())
  })

  test('Should throw if LoadSurveysRepository.loadSurveys throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadSurveys').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.load(mockAccountId())
    await expect(promise).rejects.toThrow()
  })
})
