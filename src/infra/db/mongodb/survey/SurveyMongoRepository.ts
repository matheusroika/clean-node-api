import { mongoHelper } from '../helpers/mongoHelper'
import type { Collection } from 'mongodb'
import type { Survey } from '@/domain/models/Survey'
import type { AddSurveyValues } from '@/domain/useCases/AddSurvey'
import type { AddSurveyRepository } from '@/data/protocols/db/survey/AddSurveyRepository'
import type { LoadSurveysRepository } from '@/data/protocols/db/survey/LoadSurveysRepository'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async getSurveyCollection (): Promise<Collection> {
    return await mongoHelper.getCollection('surveys')
  }

  async add (surveyData: AddSurveyValues): Promise<void> {
    const surveyCollection = await this.getSurveyCollection()
    const document = await surveyCollection.insertOne({
      ...surveyData,
      date: new Date()
    })
    const survey = await surveyCollection.findOne({ _id: document.insertedId })
    if (!survey) throw new Error()
  }

  async loadSurveys (): Promise<Survey[]> {
    const surveyCollection = await this.getSurveyCollection()
    const surveys: Survey[] = await surveyCollection.find().toArray() as any
    return surveys
  }
}
