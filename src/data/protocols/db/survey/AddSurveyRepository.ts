import type { AddSurveyValues } from '@/data/useCases/addSurvey/DbAddSurveyProtocols'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyValues) => Promise<void>
}
