import type { SurveyResponse } from '@/domain/models/SurveyResponse'

export type SurveyResponseParams = Omit<SurveyResponse, 'id'>

export interface SaveSurveyResponse {
  save: (data: SurveyResponseParams) => Promise<SurveyResponse>
}
