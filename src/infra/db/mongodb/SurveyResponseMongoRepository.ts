import { mongoHelper } from './mongoHelper'
import { ObjectId } from 'mongodb'
import type { Collection, Document } from 'mongodb'
import type { SurveyResponse } from '@/domain/models/SurveyResponse'
import type { SaveSurveyResponseParams } from '@/domain/useCases/surveyResponse/SaveSurveyResponse'
import type { SaveSurveyResponseRepository } from '@/data/protocols/db/surveyResponse/SaveSurveyResponseRepository'
import type { LoadSurveyResponseRepository } from '@/data/protocols/db/surveyResponse/LoadSurveyResponseRepository'
import type { LoadSurveyResponseParams } from '@/domain/useCases/surveyResponse/LoadSurveyResponse'

export class SurveyResponseMongoRepository implements SaveSurveyResponseRepository, LoadSurveyResponseRepository {
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
    const lastErrorObject = document.lastErrorObject as Document
    const isUpdate = lastErrorObject.updatedExisting
    const oldAnswer = document.value?.answer
    await this.updateSurvey(isUpdate, surveyId, oldAnswer, answer)

    const updatedDocument = await surveyResponseCollection.findOne({
      surveyId: new ObjectId(surveyId),
      accountId: new ObjectId(accountId)
    })
    return updatedDocument && mongoHelper.map(updatedDocument)
  }

  async load (data: LoadSurveyResponseParams): Promise<SurveyResponse | null> {
    const surveyResponseCollection = await this.getSurveyResponseCollection()
    const { surveyId, accountId } = data
    if (!ObjectId.isValid(surveyId) || !ObjectId.isValid(accountId)) return null
    const document = await surveyResponseCollection.findOne({
      surveyId: new ObjectId(surveyId),
      accountId: new ObjectId(accountId)
    })
    return document ? mongoHelper.map(document) : null
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
