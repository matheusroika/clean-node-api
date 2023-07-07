export type SurveyAnswer = {
  image?: string
  answer: string
}

export type SurveyParams = {
  question: string
  answers: SurveyAnswer[]
}

export interface AddSurvey {
  add: (data: SurveyParams) => Promise<void>
}
