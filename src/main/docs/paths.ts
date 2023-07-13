import { loginPath, signUpPath, loadSurveysPath, addSurveyPath, saveSurveyResponsePath, loadSurveyResponsePath } from './paths/'

export default {
  '/login': loginPath,
  '/signup': signUpPath,
  '/surveys': {
    ...loadSurveysPath,
    ...addSurveyPath
  },
  '/surveys/{surveyId}/response': {
    ...saveSurveyResponsePath,
    ...loadSurveyResponsePath
  }
}
