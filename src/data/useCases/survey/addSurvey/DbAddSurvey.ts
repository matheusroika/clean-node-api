import type { AddSurvey, AddSurveyRepository, SurveyParams } from './DbAddSurveyProtocols'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSurveyRepository: AddSurveyRepository
  ) {}

  async add (data: SurveyParams): Promise<void> {
    await this.addSurveyRepository.add(data)
  }
}
