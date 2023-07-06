import type { SurveyResponse } from '@/domain/models/SurveyResponse'

export type SurveyResponseData = Omit<SurveyResponse, 'id'>

export interface SaveSurveyResponse {
  save: (data: SurveyResponseData) => Promise<SurveyResponse>
}
