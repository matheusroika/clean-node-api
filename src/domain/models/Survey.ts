import type { SurveyAnswer } from '@/domain/useCases/AddSurvey'

export type Survey = {
  question: string
  answers: SurveyAnswer[]
  date: Date
}
