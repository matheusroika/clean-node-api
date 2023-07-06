import type { Survey } from '@/domain/models/Survey'

export interface LoadSurveyById {
  loadById: (id: string) => Promise<Survey | null>
}
