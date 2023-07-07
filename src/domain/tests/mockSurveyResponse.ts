import type { SurveyResponse } from '@/domain/models/SurveyResponse'
import type { SaveSurveyResponse, SaveSurveyResponseParams } from '@/domain/useCases/surveyResponse/SaveSurveyResponse'

export const mockSaveSurveyResponseParams = (): SaveSurveyResponseParams => ({
  surveyId: 'survey_id',
  accountId: 'account_id',
  answer: 'any_answer',
  date: new Date('2023-07-03T05:52:28.514Z')
})

export const mockSurveyResponse = (): SurveyResponse => ({
  id: 'any_id',
  ...mockSaveSurveyResponseParams()
})

export const mockSaveSurveyResponse = (): SaveSurveyResponse => {
  class SaveSurveyResponseStub implements SaveSurveyResponse {
    async save (data: SaveSurveyResponseParams): Promise<SurveyResponse> {
      return mockSurveyResponse()
    }
  }
  return new SaveSurveyResponseStub()
}
