import { InvalidParamError, forbidden, ok } from '@/presentation/middlewares/AuthMiddlewareProtocols'
import type { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './SaveSurveyResponseControllerProtocols'

export class SaveSurveyResponseController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveyId = httpRequest.params.surveyId
    const survey = await this.loadSurveyById.loadById(surveyId)
    if (!survey) return forbidden(new InvalidParamError('params.surveyId'))
    return ok('')
  }
}
