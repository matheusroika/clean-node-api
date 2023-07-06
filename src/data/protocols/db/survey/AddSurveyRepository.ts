import type { SurveyValues } from '@/domain/useCases/survey/AddSurvey'

export interface AddSurveyRepository {
  add: (surveyData: SurveyValues) => Promise<void>
}
