import type { Controller, HttpRequest, HttpResponse, Validation } from './AddSurveyControllerProtocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body)

    return {
      statusCode: 200,
      body: {
        ok: 'ok'
      }
    }
  }
}
