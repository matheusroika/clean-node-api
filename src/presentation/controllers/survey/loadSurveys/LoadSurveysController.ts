import type { Controller, HttpRequest, HttpResponse, LoadSurveys } from './LoadSurveysControllerProtocols'
import { ok, serverError } from './LoadSurveysControllerProtocols'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      return ok(surveys)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
