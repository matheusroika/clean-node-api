import { mongoHelper } from '../helpers/mongoHelper'
import { ObjectId } from 'mongodb'
import type { Collection, Document } from 'mongodb'
import type { SurveyResponse } from '@/domain/models/SurveyResponse'
import type { SaveSurveyResponseParams } from '@/domain/useCases/surveyResponse/SaveSurveyResponse'
import type { SaveSurveyResponseRepository } from '@/data/protocols/db/surveyResponse/SaveSurveyResponseRepository'

export class SurveyResponseMongoRepository implements SaveSurveyResponseRepository {
  async getSurveyResponseCollection (): Promise<Collection> {
    return await mongoHelper.getCollection('surveyResponses')
  }

  async getSurveyCollection (): Promise<Collection> {
    return await mongoHelper.getCollection('surveys')
  }

  async save (data: SaveSurveyResponseParams): Promise<SurveyResponse> {
    const surveyResponseCollection = await this.getSurveyResponseCollection()
    const { surveyId, accountId, answer } = data
    const document = await surveyResponseCollection.findOneAndUpdate({
      surveyId: new ObjectId(surveyId),
      accountId: new ObjectId(accountId)
    }, {
      $set: {
        answer,
        date: new Date()
      }
    }, {
      upsert: true
    })
    const isUpdate = document.lastErrorObject?.updatedExisting
    const oldAnswer = document.value?.answer
    await this.updateSurvey(isUpdate, surveyId, oldAnswer, answer)

    const updatedDocument = await surveyResponseCollection.findOne({
      surveyId: new ObjectId(surveyId),
      accountId: new ObjectId(accountId)
    })
    return updatedDocument && mongoHelper.map(updatedDocument)
  }

  private async updateSurvey (isUpdate: boolean, surveyId: string, oldAnswer: string, answer: string): Promise<void> {
    const surveyCollection = await this.getSurveyCollection()
    const updatedSurvey = await this.getUpdatedSurvey(surveyCollection, isUpdate, surveyId, oldAnswer, answer)
    await surveyCollection.findOneAndUpdate({
      _id: new ObjectId(surveyId)
    }, {
      $set: updatedSurvey[0]
    })
  }

  private async getUpdatedSurvey (surveyCollection: Collection<Document>, isUpdate: boolean, surveyId: string, oldAnswer: string, answer: string): Promise<Document[]> {
    const aggregation = isUpdate
      ? mongoHelper.getUpdateAggregation(surveyId, oldAnswer, answer)
      : mongoHelper.getNewAggregation(surveyId, answer)
    const query = surveyCollection.aggregate(aggregation)
    const updatedSurvey = await query.toArray()
    return updatedSurvey
  }
}
