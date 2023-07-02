// import type { HttpRequest } from '../protocols'
import { forbidden } from '../helpers/http/httpHelper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './AuthMiddleware'

interface Sut {
  sut: AuthMiddleware
}

const makeSut = (): Sut => {
  const sut = new AuthMiddleware()
  return {
    sut
  }
}

// const makeFakeRequest = (): HttpRequest => ({
// })

describe('Authentication Middleware', () => {
  test('Should return 403 if no x-access-token header exists', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
