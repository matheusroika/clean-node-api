import { SurveyMongoRepository } from '@/infra/db/mongodb/SurveyMongoRepository'
import { DbLoadSurveys } from '@/data/useCases/survey/DbLoadSurveys'

export const makeDbLoadSurveys = (): DbLoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}
