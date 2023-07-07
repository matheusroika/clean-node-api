import { DbLoadSurveyById } from './DbLoadSurveyById'
import type { LoadSurveyByIdRepository, Survey } from './DbLoadSurveyByIdProtocols'

const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<Survey | null> {
      return makeFakeSurvey()
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

type Sut = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): Sut => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

const makeFakeSurvey = (): Survey => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date('2023-07-03T05:52:28.514Z')
})

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
    expect(survey).toEqual(makeFakeSurvey())
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
