import { ok, serverError, noContent } from './LoadSurveysControllerProtocols'
import type { Controller, HttpRequest, HttpResponse, LoadSurveys } from './LoadSurveysControllerProtocols'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(httpRequest?.accountId as string)
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
