import type { SurveyResponse } from '@/domain/models/SurveyResponse'
import type { SaveSurveyResponseParams } from '@/domain/useCases/surveyResponse/SaveSurveyResponse'

export interface SaveSurveyResponseRepository {
  save: (data: SaveSurveyResponseParams) => Promise<SurveyResponse>
}
