import type { Survey } from '@/domain/models/Survey'

export interface LoadSurveys {
  load: () => Promise<Survey[]>
}
