import { DbSaveSurveyResponse } from '@/data/useCases/surveyResponse/DbSaveSurveyResponse'
import { SurveyResponseMongoRepository } from '@/infra/db/mongodb/SurveyResponseMongoRepository'

export const makeDbSaveSurveyResponse = (): DbSaveSurveyResponse => {
  const surveyResponseMongoRepository = new SurveyResponseMongoRepository()
  return new DbSaveSurveyResponse(surveyResponseMongoRepository)
}
