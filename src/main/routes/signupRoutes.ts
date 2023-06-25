import { adaptRoute } from '../adapters/express/expressRouteAdapter'
import type { Router } from 'express'
import { makeSignUpController } from '../factories/signUp/signUpFactory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
}
