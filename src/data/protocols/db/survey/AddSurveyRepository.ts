import type { SurveyValues } from '@/domain/useCases/AddSurvey'

export interface AddSurveyRepository {
  add: (surveyData: SurveyValues) => Promise<void>
}
