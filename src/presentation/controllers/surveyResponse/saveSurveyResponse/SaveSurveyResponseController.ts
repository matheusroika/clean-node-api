import { InvalidParamError, forbidden, ok, serverError } from '@/presentation/middlewares/AuthMiddlewareProtocols'
import type { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './SaveSurveyResponseControllerProtocols'

export class SaveSurveyResponseController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('params.surveyId'))
      if (!survey.answers.includes(answer)) return forbidden(new InvalidParamError('body.answer'))
      return ok('')
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
