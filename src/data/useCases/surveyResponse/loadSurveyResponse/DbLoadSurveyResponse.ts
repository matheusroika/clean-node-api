import type { SurveyResponse, LoadSurveyResponse, LoadSurveyResponseRepository, LoadSurveyResponseParams } from './DbLoadSurveyResponseProtocols'

export class DbLoadSurveyResponse implements LoadSurveyResponse {
  constructor (
    private readonly loadSurveyResponseRepository: LoadSurveyResponseRepository
  ) {}

  async load (data: LoadSurveyResponseParams): Promise<SurveyResponse | null> {
    const surveyResponse = await this.loadSurveyResponseRepository.load(data)
    return surveyResponse
  }
}
