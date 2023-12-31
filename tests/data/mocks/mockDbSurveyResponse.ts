import { mockSurveyResponse } from '@/../tests/domain/mocks'
import type { SurveyResponse } from '@/domain/models/SurveyResponse'
import type { SaveSurveyResponseParams } from '@/domain/useCases/surveyResponse/SaveSurveyResponse'
import type { LoadSurveyResponseParams } from '@/domain/useCases/surveyResponse/LoadSurveyResponse'
import type { SaveSurveyResponseRepository } from '@/data/protocols/db/surveyResponse/SaveSurveyResponseRepository'
import type { LoadSurveyResponseRepository } from '@/data/protocols/db/surveyResponse/LoadSurveyResponseRepository'

export const mockSaveSurveyResponseRepository = (): SaveSurveyResponseRepository => {
  class SaveSurveyResponseRepositoryStub implements SaveSurveyResponseRepository {
    async save (data: SaveSurveyResponseParams): Promise<SurveyResponse> {
      return mockSurveyResponse()
    }
  }
  return new SaveSurveyResponseRepositoryStub()
}

export const mockLoadSurveyResponseRepository = (): LoadSurveyResponseRepository => {
  class LoadSurveyResponseRepositoryStub implements LoadSurveyResponseRepository {
    async load (data: LoadSurveyResponseParams): Promise<SurveyResponse | null> {
      return mockSurveyResponse()
    }
  }
  return new LoadSurveyResponseRepositoryStub()
}
