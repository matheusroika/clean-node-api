import type { SurveyResponse } from '@/domain/models/SurveyResponse'
import type { SaveSurveyResponse, SaveSurveyResponseParams } from '@/domain/useCases/surveyResponse/SaveSurveyResponse'
import type { LoadSurveyResponseParams } from '@/domain/useCases/surveyResponse/LoadSurveyResponse'

export const mockLoadSurveyResponseParams = (): LoadSurveyResponseParams => ({
  surveyId: 'survey_id',
  accountId: 'account_id'
})

export const mockSaveSurveyResponseParams = (): SaveSurveyResponseParams => ({
  ...mockLoadSurveyResponseParams(),
  answer: 'any_answer'
})

export const mockSurveyResponse = (): SurveyResponse => ({
  id: 'any_id',
  ...mockSaveSurveyResponseParams(),
  date: new Date('2023-07-03T05:52:28.514Z')
})

export const mockSaveSurveyResponse = (): SaveSurveyResponse => {
  class SaveSurveyResponseStub implements SaveSurveyResponse {
    async save (data: SaveSurveyResponseParams): Promise<SurveyResponse> {
      return mockSurveyResponse()
    }
  }
  return new SaveSurveyResponseStub()
}
