import type { Survey } from '@/domain/models/Survey'

export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise<Survey | null>
}
