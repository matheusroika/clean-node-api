import { mongoHelper } from '../helpers/mongoHelper'
import type { Collection } from 'mongodb'
import type { SurveyResponse } from '@/domain/models/SurveyResponse'
import type { SurveyResponseParams } from '@/domain/useCases/surveyResponse/SaveSurveyResponse'
import type { SaveSurveyResponseRepository } from '@/data/protocols/db/surveyResponse/SaveSurveyResponseRepository'

export class SurveyResponseMongoRepository implements SaveSurveyResponseRepository {
  async getSurveyResponseCollection (): Promise<Collection> {
    return await mongoHelper.getCollection('surveyResponses')
  }

  async save (data: SurveyResponseParams): Promise<SurveyResponse> {
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
