export type SurveyAnswer = {
  image?: string
  answer: string
}

export type SurveyValues = {
  question: string
  answers: SurveyAnswer[]
}

export interface AddSurvey {
  add: (data: SurveyValues) => Promise<void>
}
