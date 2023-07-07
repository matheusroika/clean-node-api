import { mockSurvey, mockSurveys } from '@/domain/tests'
import type { Survey } from '@/domain/models/Survey'
import type { AddSurveyParams } from '@/domain/useCases/survey/AddSurvey'
import type { AddSurveyRepository } from '@/data/protocols/db/survey/AddSurveyRepository'
import type { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/LoadSurveyByIdRepository'
import type { LoadSurveysRepository } from '@/data/protocols/db/survey/LoadSurveysRepository'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyParams): Promise<void> {}
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<Survey | null> {
      return mockSurvey()
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepositoryStub = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadSurveys (): Promise<Survey[]> {
      return mockSurveys()
    }
  }
  return new LoadSurveysRepositoryStub()
}
