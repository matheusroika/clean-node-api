import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import type { LoadSurveyById } from '@/domain/useCases/survey/LoadSurveyById'
import type { SaveSurveyResponse } from '@/domain/useCases/surveyResponse/SaveSurveyResponse'
import type { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class SaveSurveyResponseController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResponse: SaveSurveyResponse
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('params.surveyId'))

      const { answer } = httpRequest.body
      const answers = survey.answers.map(a => a.answer)
      if (!answers.includes(answer)) return forbidden(new InvalidParamError('body.answer'))

      const { accountId } = httpRequest
      if (!accountId) return badRequest(new MissingParamError('accountId'))

      const surveyResponse = await this.saveSurveyResponse.save({
        surveyId,
        accountId,
        answer
      })
      return ok(surveyResponse)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
