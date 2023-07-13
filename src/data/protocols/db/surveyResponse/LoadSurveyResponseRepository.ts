import type { SurveyResponse } from '@/domain/models/SurveyResponse'
import type { LoadSurveyResponseParams } from '@/domain/useCases/surveyResponse/LoadSurveyResponse'

export interface LoadSurveyResponseRepository {
  load: (data: LoadSurveyResponseParams) => Promise<SurveyResponse | null>
}
