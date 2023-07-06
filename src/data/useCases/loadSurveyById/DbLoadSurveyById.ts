import type { LoadSurveyById, LoadSurveyByIdRepository, Survey } from './DbLoadSurveyByIdProtocols'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async loadById (id: string): Promise<Survey> {
    const survey = await this.loadSurveyByIdRepository.loadById(id)
    return survey
  }
}
