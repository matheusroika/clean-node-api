import { mongoHelper } from '../helpers/mongoHelper'
import type { Collection } from 'mongodb'
import type { SurveyResponse } from '@/domain/models/SurveyResponse'
import type { SurveyResponseData } from '@/domain/useCases/SaveSurveyResponse'
import type { SaveSurveyResponseRepository } from '@/data/protocols/db/survey/SaveSurveyResponseRepository'

export class SurveyResponseMongoRepository implements SaveSurveyResponseRepository {
  async getSurveyCollection (): Promise<Collection> {
    return await mongoHelper.getCollection('surveys')
  }

  async getSurveyResponseCollection (): Promise<Collection> {
    return await mongoHelper.getCollection('surveyResponses')
  }

  async save (data: SurveyResponseData): Promise<SurveyResponse> {
    const surveyResponseCollection = await this.getSurveyResponseCollection()
    const { surveyId, accountId, answer, date } = data
    const document = await surveyResponseCollection.findOneAndUpdate({
      surveyId,
      accountId
    }, {
      $set: {
        answer,
        date
      }
    }, {
      upsert: true,
      returnDocument: 'after'
    })
    return document.value && mongoHelper.map(document.value)
  }
}
