import type { SurveyResponse } from '@/domain/models/SurveyResponse'
import type { SurveyResponseData } from '@/domain/useCases/surveyResponse/SaveSurveyResponse'

export interface SaveSurveyResponseRepository {
  save: (data: SurveyResponseData) => Promise<SurveyResponse>
}
