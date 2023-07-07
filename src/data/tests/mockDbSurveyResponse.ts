import { mockSurveyResponse } from '@/domain/tests'
import type { SurveyResponse } from '@/domain/models/SurveyResponse'
import type { SaveSurveyResponseParams } from '@/domain/useCases/surveyResponse/SaveSurveyResponse'
import type { SaveSurveyResponseRepository } from '@/data/protocols/db/surveyResponse/SaveSurveyResponseRepository'

export const mockSaveSurveyResponseRepository = (): SaveSurveyResponseRepository => {
  class SaveSurveyResponseRepositoryStub implements SaveSurveyResponseRepository {
    async save (data: SaveSurveyResponseParams): Promise<SurveyResponse> {
      return mockSurveyResponse()
    }
  }
  return new SaveSurveyResponseRepositoryStub()
}
