import { badRequest, noContent, serverError } from '@/presentation/helpers/http'
import type { AddSurvey, AddSurveyAnswer } from '@/domain/useCases/survey/AddSurvey'
import type { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export type AddSurveyControllerRequest = {
  question: string
  answers: AddSurveyAnswer[]
}

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (request: AddSurveyControllerRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)

      const { question, answers } = request
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
