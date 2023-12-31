import { LogControllerDecorator } from '@/main/decorators/LogControllerDecorator'
import { ok, serverError } from '@/presentation/helpers/http'
import { mockAccount } from '@/../tests/domain/mocks'
import { mockLogErrorRepository } from '@/../tests/data/mocks'
import type { SignUpControllerRequest } from '@/presentation/controllers/authentication/SignUpController'
import type { Controller, HttpResponse } from '@/presentation/protocols'
import type { LogErrorRepository } from '@/data/protocols/db/log/LogErrorRepository'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (request: any): Promise<HttpResponse> {
      return ok(mockAccount())
    }
  }
  return new ControllerStub()
}

type Sut = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): Sut => {
  const logErrorRepositoryStub = mockLogErrorRepository()
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'Any stack'
  return serverError(fakeError)
}

const mockRequest = (): SignUpControllerRequest => ({
  name: 'Any Name',
  email: 'any@email.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

describe('Log Controller Decorator', () => {
  test('Should call controller.handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(mockRequest())
    expect(handleSpy).toHaveBeenCalledWith(mockRequest())
  })

  test('Should return the same as the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockAccount()))
  })

  test('Should call LogErrorRepository with correct error if controller return a ServerError', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(makeFakeServerError())
    await sut.handle(mockRequest())
    expect(logSpy).toHaveBeenCalledWith('Any stack')
  })
})
