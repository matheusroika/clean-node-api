import { InvalidParamError, MissingParamError, badRequest, forbidden, ok, serverError } from './LoadSurveyResponseControllerProtocols'
import type { Controller, HttpRequest, HttpResponse, LoadSurveyResponse } from './LoadSurveyResponseControllerProtocols'

export class LoadSurveyResponseController implements Controller {
  constructor (
    private readonly loadSurveyResponse: LoadSurveyResponse
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest
      if (!accountId) return badRequest(new MissingParamError('accountId'))

      const { surveyId } = httpRequest.params
      const surveyResponse = await this.loadSurveyResponse.load({
        accountId,
        surveyId
      })
      if (!surveyResponse) return forbidden(new InvalidParamError('params.surveyId'))

      return ok(surveyResponse)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
