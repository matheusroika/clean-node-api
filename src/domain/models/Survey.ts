import type { SurveyAnswer } from '../useCases/AddSurvey'

export interface Survey {
  question: string
  answers: SurveyAnswer[]
  date: Date
}
