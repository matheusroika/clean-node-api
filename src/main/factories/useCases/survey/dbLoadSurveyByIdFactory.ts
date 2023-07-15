import { SurveyMongoRepository } from '@/infra/db/mongodb/SurveyMongoRepository'
import { DbLoadSurveyById } from '@/data/useCases/survey/DbLoadSurveyById'

export const makeDbLoadSurveyByIdFactory = (): DbLoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyMongoRepository)
}
