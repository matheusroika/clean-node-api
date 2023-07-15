import type { LoadSurveys, LoadSurveysRepository, Survey } from './DbLoadSurveysProtocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository
  ) {}

  async load (accountId: string): Promise<Survey[]> {
    const surveys = await this.loadSurveysRepository.loadSurveys(accountId)
    return surveys
  }
}
