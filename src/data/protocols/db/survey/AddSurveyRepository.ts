import type { SurveyParams } from '@/domain/useCases/survey/AddSurvey'

export interface AddSurveyRepository {
  add: (surveyData: SurveyParams) => Promise<void>
}
