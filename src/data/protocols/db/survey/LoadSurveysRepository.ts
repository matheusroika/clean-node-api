import type { Survey } from '@/domain/models/Survey'

export interface LoadSurveysRepository {
  loadSurveys: (accountId: string) => Promise<Survey[]>
}
