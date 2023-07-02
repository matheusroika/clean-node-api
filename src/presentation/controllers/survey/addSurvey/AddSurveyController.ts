import { badRequest } from '../../../helpers/http/httpHelper'
import type { AddSurvey, Controller, HttpRequest, HttpResponse, Validation } from './AddSurveyControllerProtocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) return badRequest(error)

    const { question, answers } = httpRequest.body
    await this.addSurvey.add({
      question,
      answers
    })

    return {
      statusCode: 200,
      body: {
        ok: 'ok'
      }
    }
  }
}
