import { SurveyMongoRepository } from '@/infra/db/mongodb/SurveyMongoRepository'
import { DbAddSurvey } from '@/data/useCases/survey/DbAddSurvey'

export const makeDbAddSurvey = (): DbAddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurvey(surveyMongoRepository)
}
