import type { AddSurveyParams } from '@/domain/useCases/survey/AddSurvey'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyParams) => Promise<void>
}
