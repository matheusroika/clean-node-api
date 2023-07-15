import { mongoHelper } from './mongoHelper'
import { ObjectId } from 'mongodb'
import type { Collection } from 'mongodb'
import type { Survey } from '@/domain/models/Survey'
import type { AddSurveyParams } from '@/domain/useCases/survey/AddSurvey'
import type { AddSurveyRepository } from '@/data/protocols/db/survey/AddSurveyRepository'
import type { LoadSurveysRepository } from '@/data/protocols/db/survey/LoadSurveysRepository'
import type { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/LoadSurveyByIdRepository'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async getSurveyCollection (): Promise<Collection> {
    return await mongoHelper.getCollection('surveys')
  }

  async add (surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await this.getSurveyCollection()
    const answers = surveyData.answers.map(answer => ({
      ...answer,
      count: 0,
      percent: 0
    }))
    const document = await surveyCollection.insertOne({
      question: surveyData.question,
      answers,
      totalResponses: 0,
      date: new Date()
    })
    const survey = await surveyCollection.findOne({ _id: document.insertedId })
    if (!survey) throw new Error()
  }

  async loadSurveys (accountId: string): Promise<Survey[]> {
    const surveyCollection = await this.getSurveyCollection()
    const surveys = await surveyCollection.aggregate(mongoHelper.getAnsweredAggregation(accountId)).toArray()
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
