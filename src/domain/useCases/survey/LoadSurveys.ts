import type { Survey } from '@/domain/models/Survey'

export interface LoadSurveys {
  load: (accountId: string) => Promise<Survey[]>
}
