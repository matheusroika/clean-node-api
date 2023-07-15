import { DbLoadSurveyResponse } from '@/data/useCases/surveyResponse/DbLoadSurveyResponse'
import { SurveyResponseMongoRepository } from '@/infra/db/mongodb/SurveyResponseMongoRepository'

export const makeDbLoadSurveyResponse = (): DbLoadSurveyResponse => {
  const surveyResponseMongoRepository = new SurveyResponseMongoRepository()
  return new DbLoadSurveyResponse(surveyResponseMongoRepository)
}
