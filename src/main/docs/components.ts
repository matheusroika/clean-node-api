import { badRequest, unauthorized, serverError, forbidden, apiKeyAuth } from './components/'

export default {
  securitySchemes: {
    apiKeyAuth
  },
  badRequest,
  unauthorized,
  serverError,
  forbidden
}
