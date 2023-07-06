import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/SurveyMongoRepository'
import { DbLoadSurveys } from '@/data/useCases/loadSurveys/DbLoadSurveys'

export const makeDbLoadSurveys = (): DbLoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}