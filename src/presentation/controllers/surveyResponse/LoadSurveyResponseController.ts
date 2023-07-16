import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import type { LoadSurveyResponse } from '@/domain/useCases/surveyResponse/LoadSurveyResponse'
import type { Controller, HttpResponse } from '@/presentation/protocols'

export type LoadSurveyResponseControllerRequest = {
  accountId?: string
  surveyId: string
}

export class LoadSurveyResponseController implements Controller {
  constructor (
    private readonly loadSurveyResponse: LoadSurveyResponse
  ) {}

  async handle (request: LoadSurveyResponseControllerRequest): Promise<HttpResponse> {
    try {
      const { accountId, surveyId } = request
      if (!accountId) return badRequest(new MissingParamError('accountId'))

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
