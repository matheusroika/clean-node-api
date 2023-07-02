import { DbAddSurvey } from '../../../../data/useCases/addSurvey/DbAddSurvey'
import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey/SurveyMongoRepository'

export const makeDbAddSurvey = (): DbAddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurvey(surveyMongoRepository)
}
