import { DbLoadSurveys } from '../../../../data/useCases/loadSurveys/DbLoadSurveys'
import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey/SurveyMongoRepository'

export const makeDbLoadSurveys = (): DbLoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}
