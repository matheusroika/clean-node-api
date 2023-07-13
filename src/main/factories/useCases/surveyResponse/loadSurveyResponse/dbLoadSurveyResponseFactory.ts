import { DbLoadSurveyResponse } from '@/data/useCases/surveyResponse/loadSurveyResponse/DbLoadSurveyResponse'
import { SurveyResponseMongoRepository } from '@/infra/db/mongodb/surveyResponse/SurveyResponseMongoRepository'

export const makeDbLoadSurveyResponse = (): DbLoadSurveyResponse => {
  const surveyResponseMongoRepository = new SurveyResponseMongoRepository()
  return new DbLoadSurveyResponse(surveyResponseMongoRepository)
}
