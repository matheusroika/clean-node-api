import type { Survey } from '../models/Survey'

export interface LoadSurveys {
  load: () => Promise<Survey[]>
}
