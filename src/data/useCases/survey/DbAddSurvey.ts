import type { AddSurvey, AddSurveyParams } from '@/domain/useCases/survey/AddSurvey'
import type { AddSurveyRepository } from '@/data/protocols/db/survey/AddSurveyRepository'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSurveyRepository: AddSurveyRepository
  ) {}

  async add (data: AddSurveyParams): Promise<void> {
    await this.addSurveyRepository.add(data)
  }
}
