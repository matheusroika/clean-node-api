import type { Survey } from '@/domain/models/Survey'

export interface LoadSurveysRepository {
  loadSurveys: () => Promise<Survey[]>
}
