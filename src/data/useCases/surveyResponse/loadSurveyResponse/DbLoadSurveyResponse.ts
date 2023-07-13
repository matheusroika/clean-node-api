import type { SurveyResponse, LoadSurveyResponse, LoadSurveyResponseRepository, LoadSurveyResponseParams } from './DbLoadSurveyResponseProtocols'

export class DbLoadSurveyResponse implements LoadSurveyResponse {
  constructor (
    private readonly loadSurveyResponseRepository: LoadSurveyResponseRepository
  ) {}

  async load (data: LoadSurveyResponseParams): Promise<SurveyResponse> {
    const surveyResponse = await this.loadSurveyResponseRepository.loadBySurveyId(data)
    return surveyResponse
  }
}
