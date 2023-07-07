import type { SaveSurveyResponse, SaveSurveyResponseRepository, SurveyResponse, SaveSurveyResponseParams } from './DbSaveSurveyResponseProtocols'

export class DbSaveSurveyResponse implements SaveSurveyResponse {
  constructor (
    private readonly saveSurveyResponseRepository: SaveSurveyResponseRepository
  ) {}

  async save (data: SaveSurveyResponseParams): Promise<SurveyResponse> {
    const surveyResponse = await this.saveSurveyResponseRepository.save(data)
    return surveyResponse
  }
}
