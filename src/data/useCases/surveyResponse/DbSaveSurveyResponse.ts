import type { SurveyResponse } from '@/domain/models/SurveyResponse'
import type { SaveSurveyResponse, SaveSurveyResponseParams } from '@/domain/useCases/surveyResponse/SaveSurveyResponse'
import type { SaveSurveyResponseRepository } from '@/data/protocols/db/surveyResponse/SaveSurveyResponseRepository'

export class DbSaveSurveyResponse implements SaveSurveyResponse {
  constructor (
    private readonly saveSurveyResponseRepository: SaveSurveyResponseRepository
  ) {}

  async save (data: SaveSurveyResponseParams): Promise<SurveyResponse> {
    const surveyResponse = await this.saveSurveyResponseRepository.save(data)
    return surveyResponse
  }
}
