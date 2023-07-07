import type { SaveSurveyResponse, SaveSurveyResponseRepository, SurveyResponse, SurveyResponseParams } from './DbSaveSurveyResponseProtocols'

export class DbSaveSurveyResponse implements SaveSurveyResponse {
  constructor (
    private readonly saveSurveyResponseRepository: SaveSurveyResponseRepository
  ) {}

  async save (data: SurveyResponseParams): Promise<SurveyResponse> {
    const surveyResponse = await this.saveSurveyResponseRepository.save(data)
    return surveyResponse
  }
}
