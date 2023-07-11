import type { Survey, SurveyAnswer } from '@/domain/models/Survey'
import type { AddSurvey, AddSurveyAnswer, AddSurveyParams } from '@/domain/useCases/survey/AddSurvey'
import type { LoadSurveys } from '@/domain/useCases/survey/LoadSurveys'
import type { LoadSurveyById } from '@/domain/useCases/survey/LoadSurveyById'

const mockAnswer = (haveCount: boolean): SurveyAnswer | AddSurveyAnswer => {
  return haveCount
    ? {
        image: 'any_image',
        answer: 'any_answer',
        count: 0,
        percent: 0
      }
    : {
        image: 'any_image',
        answer: 'any_answer'
      }
}

const mockAnswers = (haveCount: boolean): SurveyAnswer[] | AddSurveyAnswer[] => {
  return haveCount
    ? [
        mockAnswer(haveCount),
        {
          answer: 'other_answer',
          count: 0,
          percent: 0
        }
      ]
    : [
        mockAnswer(haveCount),
        {
          answer: 'other_answer'
        }
      ]
}

type SurveyParams = Omit<Survey, 'id' | 'date'>

export const mockAddSurveyParams = (haveCount: boolean): AddSurveyParams | SurveyParams => ({
  question: 'any_question',
  answers: mockAnswers(haveCount)
})

type SurveyToInsert = Omit<Survey, 'id'>

export const mockSurveyToInsertOne = (): SurveyToInsert => ({
  ...mockAddSurveyParams(true) as SurveyParams,
  date: new Date('2023-07-02T05:12:09.514Z')
})

export const mockSurveysToInsertMany = (): SurveyToInsert[] => ([
  mockSurveyToInsertOne(),
  {
    question: 'other_question',
    answers: [{
      image: 'other_image',
      answer: 'other_answer',
      count: 0,
      percent: 0
    }],
    totalResponses: 0,
    date: new Date('2023-07-03T12:31:52.514Z')
  }
])

export const mockSurvey = (): Survey => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer',
    count: 0,
    percent: 0
  }],
  totalResponses: 0,
  date: new Date('2023-07-03T05:52:28.514Z')
})

export const mockSurveys = (): Survey[] => ([
  mockSurvey(),
  {
    id: 'other_id',
    question: 'other_question',
    answers: [{
      image: 'other_image',
      answer: 'other_answer',
      count: 0,
      percent: 0
    }],
    totalResponses: 0,
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
