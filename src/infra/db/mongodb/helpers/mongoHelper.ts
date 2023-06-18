import { MongoClient } from 'mongodb'
import type { Collection, WithId, Document } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },
  async disconnect (): Promise<void> {
    await this.client.close()
  },
  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },
  map (document: WithId<Document>): any {
    const { _id, ...documentWithoutId } = document
    const formattedDocument = {
      id: _id,
      ...documentWithoutId
    }
    return formattedDocument
  }
}
