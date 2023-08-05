import { ObjectId } from 'mongodb'
import { mockSurvey } from './mockSurvey'
import type { SurveyResponse } from '@/domain/models/SurveyResponse'
import type { SaveSurveyResponse, SaveSurveyResponseParams } from '@/domain/useCases/surveyResponse/SaveSurveyResponse'
import type { LoadSurveyResponse, LoadSurveyResponseParams } from '@/domain/useCases/surveyResponse/LoadSurveyResponse'

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
  accountId: 'account_id',
  date: new Date('2023-07-03T05:52:28.514Z'),
  answer: 'any_answer',
  survey: mockSurvey()
})

type SurveyResponseToInsert = {
  surveyId: ObjectId
  accountId: ObjectId
  answer: string
  date: Date
}

export const mockSurveyResponseToInsert = (surveyId: string, accountId: string): SurveyResponseToInsert => ({
  surveyId: new ObjectId(surveyId),
  accountId: new ObjectId(accountId),
  answer: 'any_answer',
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

export const mockLoadSurveyResponse = (): LoadSurveyResponse => {
  class LoadSurveyResponseStub implements LoadSurveyResponse {
    async load (data: LoadSurveyResponseParams): Promise<SurveyResponse | null> {
      return mockSurveyResponse()
    }
  }
  return new LoadSurveyResponseStub()
}
