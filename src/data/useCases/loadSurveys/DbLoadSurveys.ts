import type { LoadSurveys, LoadSurveysRepository, Survey } from './DbLoadSurveysProtocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository
  ) {}

  async load (): Promise<Survey[]> {
    const surveys = await this.loadSurveysRepository.loadSurveys()
    return surveys
  }
}
