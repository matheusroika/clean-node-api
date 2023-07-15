import { LogMongoRepository } from '@/infra/db/mongodb/LogMongoRepository'
import { LogControllerDecorator } from '@/main/decorators/LogControllerDecorator'
import type { Controller } from '@/presentation/protocols'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
