import type { LogErrorRepository } from '@/data/protocols/db/log/LogErrorRepository'

export const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (errorStack: string): Promise<void> {
    }
  }
  return new LogErrorRepositoryStub()
}
