import type { SurveyResponse } from '@/domain/models/SurveyResponse'
import type { LoadSurveyResponse, LoadSurveyResponseParams } from '@/domain/useCases/surveyResponse/LoadSurveyResponse'
import type { LoadSurveyResponseRepository } from '@/data/protocols/db/surveyResponse/LoadSurveyResponseRepository'

export class DbLoadSurveyResponse implements LoadSurveyResponse {
  constructor (
    private readonly loadSurveyResponseRepository: LoadSurveyResponseRepository
  ) {}

  async load (data: LoadSurveyResponseParams): Promise<SurveyResponse | null> {
    const surveyResponse = await this.loadSurveyResponseRepository.load(data)
    return surveyResponse
  }
}
