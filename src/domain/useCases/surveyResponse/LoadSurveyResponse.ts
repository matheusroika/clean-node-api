import type { SurveyResponse } from '@/domain/models/SurveyResponse'

export type LoadSurveyResponseParams = {
  surveyId: string
  accountId: string
}

export interface LoadSurveyResponse {
  load: (data: LoadSurveyResponseParams) => Promise<SurveyResponse>
}
