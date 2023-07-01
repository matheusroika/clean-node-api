import { LogMongoRepository } from '../../../infra/db/mongodb/log/LogMongoRepository'
import { LogControllerDecorator } from '../../decorators/log/LogControllerDecorator'
import type { Controller } from '../../../presentation/protocols'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
