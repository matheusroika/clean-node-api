import type { SurveyResponse } from '@/domain/models/SurveyResponse'
import type { SurveyResponseParams } from '@/domain/useCases/surveyResponse/SaveSurveyResponse'

export interface SaveSurveyResponseRepository {
  save: (data: SurveyResponseParams) => Promise<SurveyResponse>
}
