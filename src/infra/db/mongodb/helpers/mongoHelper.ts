import { MongoClient } from 'mongodb'
import type { Collection, WithId, Document } from 'mongodb'

const reconnectMaxTries = 3
const reconnectDelayInMs = 5000

export const MongoHelper = {
  client: null as unknown as MongoClient | null,
  uri: null as unknown as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect (): Promise<void> {
    if (!this.client) throw new Error()
    await this.client.close()
    this.client = null
  },

  async reconnect (uri: string, times: number, delay: number): Promise<void> {
    await this.connect(uri)
    if (this.client) return

    const updatedTimes = times - 1
    if (updatedTimes <= 0) return

    setTimeout(async () => {
      await this.reconnect(uri, updatedTimes, delay)
    }, delay)
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) await this.reconnect(this.uri, reconnectMaxTries, reconnectDelayInMs)
    if (!this.client) throw new Error()
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
