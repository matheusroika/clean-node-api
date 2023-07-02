import type { AddSurveyValues } from '../../../useCases/addSurvey/DbAddSurveyProtocols'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyValues) => Promise<void>
}
