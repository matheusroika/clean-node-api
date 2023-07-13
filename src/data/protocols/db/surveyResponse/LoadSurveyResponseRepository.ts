import type { SurveyResponse } from '@/domain/models/SurveyResponse'

export interface LoadSurveyResponseRepository {
  loadBySurveyId: (surveyId: string) => Promise<SurveyResponse>
}
