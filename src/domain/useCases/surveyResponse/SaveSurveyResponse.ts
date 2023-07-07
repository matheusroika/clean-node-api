import type { SurveyResponse } from '@/domain/models/SurveyResponse'

export type SaveSurveyResponseParams = Omit<SurveyResponse, 'id'>

export interface SaveSurveyResponse {
  save: (data: SaveSurveyResponseParams) => Promise<SurveyResponse>
}
