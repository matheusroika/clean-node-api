import type { SurveyAnswer } from '@/domain/useCases/survey/AddSurvey'

export type Survey = {
  id: string
  question: string
  answers: SurveyAnswer[]
  date: Date
}
