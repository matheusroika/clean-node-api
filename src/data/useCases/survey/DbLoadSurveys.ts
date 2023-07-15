import type { Survey } from '@/domain/models/Survey'
import type { LoadSurveys } from '@/domain/useCases/survey/LoadSurveys'
import type { LoadSurveysRepository } from '@/data/protocols/db/survey/LoadSurveysRepository'

export class DbLoadSurveys implements LoadSurveys {
  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository
  ) {}

  async load (accountId: string): Promise<Survey[]> {
    const surveys = await this.loadSurveysRepository.loadSurveys(accountId)
    return surveys
  }
}
