import type { SurveyAnswer } from '@/domain/models/Survey'

export type AddSurveyAnswer = Omit<SurveyAnswer, 'count' | 'percent'>

export type AddSurveyParams = {
  question: string
  answers: AddSurveyAnswer[]
}

export interface AddSurvey {
  add: (data: AddSurveyParams) => Promise<void>
}
