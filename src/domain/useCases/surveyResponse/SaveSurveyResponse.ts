import type { SurveyResponse } from '@/domain/models/SurveyResponse'

export type SaveSurveyResponseParams = {
  surveyId: string
  accountId: string
  answer: string
}

export interface SaveSurveyResponse {
  save: (data: SaveSurveyResponseParams) => Promise<SurveyResponse>
}
