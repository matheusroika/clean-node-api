import { badRequest, noContent, serverError } from '@/presentation/helpers/http'
import type { AddSurvey } from '@/domain/useCases/survey/AddSurvey'
import type { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { question, answers } = httpRequest.body
      await this.addSurvey.add({
        question,
        answers
      })

      return noContent()
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
