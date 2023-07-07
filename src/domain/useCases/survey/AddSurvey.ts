export type SurveyAnswer = {
  image?: string
  answer: string
}

export type AddSurveyParams = {
  question: string
  answers: SurveyAnswer[]
}

export interface AddSurvey {
  add: (data: AddSurveyParams) => Promise<void>
}
