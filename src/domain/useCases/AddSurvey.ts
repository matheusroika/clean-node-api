export type SurveyAnswer = {
  image?: string
  answer: string
}

export type AddSurveyValues = {
  question: string
  answers: SurveyAnswer[]
}

export interface AddSurvey {
  add: (data: AddSurveyValues) => Promise<void>
}
