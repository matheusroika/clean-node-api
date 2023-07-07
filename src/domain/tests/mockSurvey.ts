import type { AddSurveyParams } from '@/domain/useCases/survey/AddSurvey'

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    answer: 'other_answer'
  }]
})

export const mockAddSurveyParamsIntegration = (): AddSurveyParams => ({
  question: 'Question',
  answers: [{
    answer: 'Answer 1',
    image: 'http://image.com/image.png'
  }, {
    answer: 'Answer 2'
  }]
})

interface SurveyToInsert extends AddSurveyParams {
  date: Date
}

export const mockSurveyToInsertOne = (): SurveyToInsert => ({
  ...mockAddSurveyParams(),
  date: new Date('2023-07-02T05:12:09.514Z')
})

export const mockSurveyToInsertOneIntegration = (): SurveyToInsert => ({
  ...mockAddSurveyParamsIntegration(),
  date: new Date('2023-07-02T05:12:09.514Z')
})

export const mockSurveysToInsertMany = (): SurveyToInsert[] => ([
  mockSurveyToInsertOne(),
  {
    question: 'other_question',
    answers: [{
      image: 'other_image',
      answer: 'other_answer'
    }],
    date: new Date('2023-07-03T12:31:52.514Z')
  }
])
