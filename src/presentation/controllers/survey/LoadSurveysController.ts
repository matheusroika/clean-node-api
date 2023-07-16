import { noContent, ok, serverError } from '@/presentation/helpers/http'
import type { LoadSurveys } from '@/domain/useCases/survey/LoadSurveys'
import type { Controller, HttpResponse } from '@/presentation/protocols'

export type LoadSurveysControllerRequest = {
  accountId: string
}

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (request: LoadSurveysControllerRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(request.accountId)
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
