import type { AddSurvey, AddSurveyRepository, SurveyValues } from './DbAddSurveyProtocols'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSurveyRepository: AddSurveyRepository
  ) {}

  async add (data: SurveyValues): Promise<void> {
    await this.addSurveyRepository.add(data)
  }
}
