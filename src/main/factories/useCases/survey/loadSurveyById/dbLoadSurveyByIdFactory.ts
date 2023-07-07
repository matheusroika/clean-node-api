import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/SurveyMongoRepository'
import { DbLoadSurveyById } from '@/data/useCases/survey/loadSurveyById/DbLoadSurveyById'

export const makeDbLoadSurveyByIdFactory = (): DbLoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyMongoRepository)
}
