import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/SurveyMongoRepository'
import { DbAddSurvey } from '@/data/useCases/survey/addSurvey/DbAddSurvey'

export const makeDbAddSurvey = (): DbAddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurvey(surveyMongoRepository)
}
