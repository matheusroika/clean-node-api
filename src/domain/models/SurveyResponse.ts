import type { Survey } from './Survey'

export type SurveyResponse = {
  id: string
  accountId: string
  answer: string
  date: Date
  survey: Survey
}
