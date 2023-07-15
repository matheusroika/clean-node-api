export type SurveyAnswer = {
  image?: string
  answer: string
  count: number
  percent: number
  isCurrentAccountAnswer?: boolean
}

export type Survey = {
  id: string
  question: string
  answers: SurveyAnswer[]
  totalResponses: number
  date: Date
  answered?: boolean
}
