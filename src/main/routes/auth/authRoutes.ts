import { adaptRoute } from '../../adapters/express/expressRouteAdapter'
import { makeLoginController } from '../../factories/controllers/authentication/login/loginControllerFactory'
import { makeSignUpController } from '../../factories/controllers/authentication/signUp/signUpControllerFactory'
import type { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
