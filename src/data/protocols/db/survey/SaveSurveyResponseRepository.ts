import type { SurveyResponse } from '@/domain/models/SurveyResponse'
import type { SurveyResponseData } from '@/domain/useCases/SaveSurveyResponse'

export interface SaveSurveyResponseRepository {
  save: (data: SurveyResponseData) => Promise<SurveyResponse>
}
