import type { SurveyResponse, LoadSurveyResponse, LoadSurveyResponseRepository } from './DbLoadSurveyResponseProtocols'

export class DbLoadSurveyResponse implements LoadSurveyResponse {
  constructor (
    private readonly loadSurveyResponseRepository: LoadSurveyResponseRepository
  ) {}

  async load (surveyId: string): Promise<SurveyResponse> {
    const surveyResponse = await this.loadSurveyResponseRepository.loadBySurveyId(surveyId)
    return surveyResponse
  }
}
