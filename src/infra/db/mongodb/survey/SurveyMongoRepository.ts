import type { Collection } from 'mongodb'
import type { AddSurveyRepository, AddSurveyValues } from '../../../../data/useCases/addSurvey/DbAddSurveyProtocols'
import { mongoHelper } from '../helpers/mongoHelper'

export class SurveyMongoRepository implements AddSurveyRepository {
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
}
