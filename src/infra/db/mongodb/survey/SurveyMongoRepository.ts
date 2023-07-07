import { mongoHelper } from '../helpers/mongoHelper'
import { ObjectId } from 'mongodb'
import type { Collection } from 'mongodb'
import type { Survey } from '@/domain/models/Survey'
import type { SurveyParams } from '@/domain/useCases/survey/AddSurvey'
import type { AddSurveyRepository } from '@/data/protocols/db/survey/AddSurveyRepository'
import type { LoadSurveysRepository } from '@/data/protocols/db/survey/LoadSurveysRepository'
import type { LoadSurveyByIdRepository } from '@/data/useCases/survey/loadSurveyById/DbLoadSurveyByIdProtocols'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async getSurveyCollection (): Promise<Collection> {
    return await mongoHelper.getCollection('surveys')
  }

  async add (surveyData: SurveyParams): Promise<void> {
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
    const surveys = await surveyCollection.find().toArray()
    return mongoHelper.mapArray(surveys)
  }

  async loadById (id: string): Promise<Survey | null> {
    if (!ObjectId.isValid(id)) return null
    const surveyCollection = await this.getSurveyCollection()
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    if (!survey) return null
    return mongoHelper.map(survey)
  }
}
