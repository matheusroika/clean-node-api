import { mongoHelper } from '../helpers/mongoHelper'
import type { LogErrorRepository } from '@/data/protocols/db/log/LogErrorRepository'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stackError: string): Promise<void> {
    const errorCollection = await mongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      stack: stackError,
      date: new Date()
    })
  }
}
