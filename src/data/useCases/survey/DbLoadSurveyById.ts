import type { Survey } from '@/domain/models/Survey'
import type { LoadSurveyById } from '@/domain/useCases/survey/LoadSurveyById'
import type { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/LoadSurveyByIdRepository'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async loadById (id: string): Promise<Survey | null> {
    const survey = await this.loadSurveyByIdRepository.loadById(id)
    return survey
  }
}
