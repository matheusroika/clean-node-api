import type { SaveSurveyResponse, SaveSurveyResponseRepository, SurveyResponse, SurveyResponseData } from './DbSaveSurveyResponseProtocols'

export class DbSaveSurveyResponse implements SaveSurveyResponse {
  constructor (
    private readonly saveSurveyResponseRepository: SaveSurveyResponseRepository
  ) {}

  async save (data: SurveyResponseData): Promise<SurveyResponse> {
    const surveyResponse = await this.saveSurveyResponseRepository.save(data)
    return surveyResponse
  }
}
