import type { LoadSurveys, LoadSurveysRepository, Survey } from './DbLoadSurveysProtocols'

export class DbLoadSurveys implements LoadSurveys {
  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository
  ) {}

  async load (): Promise<Survey[]> {
    await this.loadSurveysRepository.loadSurveys()
    return []
  }
}
