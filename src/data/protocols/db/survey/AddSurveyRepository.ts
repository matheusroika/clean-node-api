import type { AddSurveyValues } from '@/domain/useCases/AddSurvey'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyValues) => Promise<void>
}
