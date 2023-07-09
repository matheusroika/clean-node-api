import { loginPath, signUpPath, loadSurveysPath, addSurveyPath, saveSurveyResponsePath } from './paths/'

export default {
  '/login': loginPath,
  '/signup': signUpPath,
  '/surveys': {
    ...loadSurveysPath,
    ...addSurveyPath
  },
  '/surveys/{surveyId}/response': saveSurveyResponsePath
}
