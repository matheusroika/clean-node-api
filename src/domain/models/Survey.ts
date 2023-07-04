import type { SurveyAnswer } from '@/domain/useCases/AddSurvey'

export interface Survey {
  question: string
  answers: SurveyAnswer[]
  date: Date
}
