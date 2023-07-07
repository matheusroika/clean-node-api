import { DbSaveSurveyResponse } from '@/data/useCases/surveyResponse/saveSurveyResponse/DbSaveSurveyResponse'
import { SurveyResponseMongoRepository } from '@/infra/db/mongodb/surveyResponse/SurveyResponseMongoRepository'

export const makeDbSaveSurveyResponse = (): DbSaveSurveyResponse => {
  const surveyResponseMongoRepository = new SurveyResponseMongoRepository()
  return new DbSaveSurveyResponse(surveyResponseMongoRepository)
}
