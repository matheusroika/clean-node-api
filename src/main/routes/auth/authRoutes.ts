import { adaptRoute } from '@/main/adapters/express/expressRouteAdapter'
import { makeLoginController } from '@/main/factories/controllers/authentication/login/loginControllerFactory'
import { makeSignUpController } from '@/main/factories/controllers/authentication/signUp/signUpControllerFactory'
import type { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
