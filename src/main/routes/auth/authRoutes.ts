import { adaptRoute } from '../../adapters/express/expressRouteAdapter'
import { makeLoginController } from '../../factories/controllers/login/loginControllerFactory'
import { makeSignUpController } from '../../factories/controllers/signUp/signUpControllerFactory'
import type { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
