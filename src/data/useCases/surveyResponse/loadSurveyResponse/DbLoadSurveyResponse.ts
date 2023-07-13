import type { SurveyResponse } from '@/domain/models/SurveyResponse'
import type { LoadSurveyResponse } from '@/domain/useCases/surveyResponse/LoadSurveyResponse'
import type { LoadSurveyResponseRepository } from '@/data/protocols/db/surveyResponse/LoadSurveyResponseRepository'

export class DbLoadSurveyResponse implements LoadSurveyResponse {
  constructor (
    private readonly loadSurveyResponseRepository: LoadSurveyResponseRepository
  ) {}

  async load (surveyId: string): Promise<SurveyResponse> {
    const surveyResponse = await this.loadSurveyResponseRepository.loadBySurveyId(surveyId)
    return surveyResponse
  }
}
