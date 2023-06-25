import { adaptRoute } from '../../adapters/express/expressRouteAdapter'
import { makeLoginController } from '../../factories/login/loginFactory'
import { makeSignUpController } from '../../factories/signUp/signUpFactory'
import type { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
