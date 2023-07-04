import type { LogErrorRepository } from '@/data/protocols/db/log/LogErrorRepository'
import { mongoHelper } from '../helpers/mongoHelper'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stackError: string): Promise<void> {
    const errorCollection = await mongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      stack: stackError,
      date: new Date()
    })
  }
}
