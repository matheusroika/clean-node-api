import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/httpHelper'
import { LoginController } from './login'

const makeSut = (): LoginController => {
  const loginController = new LoginController()
  return loginController
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
