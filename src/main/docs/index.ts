import { loadSurveysPath, loginPath } from './paths'
import { account, error, loginParams, signUpParams, surveyAnswer, survey, surveys, apiKeyAuth } from './schemas'
import { badRequest, unauthorized, serverError, forbidden } from './components'
import { signUpPath } from './paths/signUpPath'

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
    '/surveys': loadSurveysPath
  },
  schemas: {
    account,
    loginParams,
    signUpParams,
    error,
    surveyAnswer,
    survey,
    surveys
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
