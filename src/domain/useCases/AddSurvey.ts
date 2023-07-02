export interface SurveyAnswer {
  image?: string
  answer: string
}

export interface AddSurveyValues {
  question: string
  answers: SurveyAnswer[]
}

export interface AddSurvey {
  add: (data: AddSurveyValues) => Promise<void>
}
