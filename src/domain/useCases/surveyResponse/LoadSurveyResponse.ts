import type { SurveyResponse } from '@/domain/models/SurveyResponse'

export interface LoadSurveyResponse {
  load: (surveyId: string) => Promise<SurveyResponse>
}
