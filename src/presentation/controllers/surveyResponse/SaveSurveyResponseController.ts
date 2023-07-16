import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import type { LoadSurveyById } from '@/domain/useCases/survey/LoadSurveyById'
import type { SaveSurveyResponse } from '@/domain/useCases/surveyResponse/SaveSurveyResponse'
import type { Controller, HttpResponse } from '@/presentation/protocols'

export type SaveSurveyResponseControllerRequest = {
  accountId?: string
  surveyId: string
  answer: string
}

export class SaveSurveyResponseController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResponse: SaveSurveyResponse
  ) {}

  async handle (request: SaveSurveyResponseControllerRequest): Promise<HttpResponse> {
    try {
      const { accountId, surveyId, answer } = request
      if (!accountId) return badRequest(new MissingParamError('accountId'))

      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('params.surveyId'))

      const answers = survey.answers.map(a => a.answer)
      if (!answers.includes(answer)) return forbidden(new InvalidParamError('body.answer'))

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
