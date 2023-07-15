import { DbLoadSurveyById } from '@/data/useCases/survey/DbLoadSurveyById'
import { mockSurvey } from '@/../tests/domain/mocks'
import { mockLoadSurveyByIdRepositoryStub } from '@/../tests/data/mocks'
import type { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/LoadSurveyByIdRepository'

type Sut = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): Sut => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepositoryStub()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('Db Load Survey by ID', () => {
  test('Should call LoadSurveyByIdRepository.loadSurveyById with correct ID', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadById = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById('any_id')
    expect(loadById).toHaveBeenCalledWith('any_id')
  })

  test('Should return a Survey on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.loadById('any_id')
    expect(survey).toEqual(mockSurvey())
  })

  test('Should return null if LoadSurveyByIdRepository.loadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockResolvedValueOnce(null)
    const survey = await sut.loadById('any_id')
    expect(survey).toBeNull()
  })

  test('Should throw if LoadSurveyByIdRepository.loadSurveyById throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
