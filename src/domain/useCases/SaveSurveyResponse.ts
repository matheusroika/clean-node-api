import type { SurveyResponse } from '@/domain/models/SurveyResponse'

export type SaveSurveyResponse = Omit<SurveyResponse, 'id'>

export interface SaveSurveyResult {
  save: (data: SaveSurveyResponse) => Promise<SurveyResponse>
}
