import { badRequest } from '../../../helpers/http/httpHelper'
import type { Controller, HttpRequest, HttpResponse, Validation } from './AddSurveyControllerProtocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) return badRequest(error)

    return {
      statusCode: 200,
      body: {
        ok: 'ok'
      }
    }
  }
}
