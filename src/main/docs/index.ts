import { loadSurveysPath, loginPath } from './paths'
import { account, error, loginParams, signUpParams, surveyAnswer, survey, surveys, addSurveyParams, apiKeyAuth } from './schemas'
import { badRequest, unauthorized, serverError, forbidden } from './components'
import { signUpPath } from './paths/signUpPath'
import { addSurveyPath } from './paths/addSurveyPath'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'Uma API em Node usando TDD, Clean Architecture, SOLID e Design Patterns, para realizar enquetes',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Authentication'
  },
  {
    name: 'Survey'
  }],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': {
      ...loadSurveysPath,
      ...addSurveyPath
    }
  },
  schemas: {
    account,
    loginParams,
    signUpParams,
    error,
    surveyAnswer,
    survey,
    surveys,
    addSurveyParams
  },
  components: {
    securitySchemes: {
      apiKeyAuth
    },
    badRequest,
    unauthorized,
    serverError,
    forbidden
  }
}
