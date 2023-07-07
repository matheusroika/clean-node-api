import type { Survey } from '@/domain/models/Survey'
import type { AddSurvey, AddSurveyParams } from '@/domain/useCases/survey/AddSurvey'
import type { LoadSurveys } from '@/domain/useCases/survey/LoadSurveys'
import type { LoadSurveyById } from '@/domain/useCases/survey/LoadSurveyById'

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

export const mockSurvey = (): Survey => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date('2023-07-03T05:52:28.514Z')
})

export const mockSurveys = (): Survey[] => ([
  mockSurvey(),
  {
    id: 'other_id',
    question: 'other_question',
    answers: [{
      image: 'other_image',
      answer: 'other_answer'
    }],
    date: new Date('2023-07-04T05:52:28.514Z')
  }
])

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {}
  }
  return new AddSurveyStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<Survey[]> {
      return mockSurveys()
    }
  }
  return new LoadSurveysStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<Survey | null> {
      return mockSurvey()
    }
  }
  return new LoadSurveyByIdStub()
}
