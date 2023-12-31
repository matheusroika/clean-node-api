import { MongoClient, ObjectId } from 'mongodb'
import { setTimeout } from 'timers/promises'
import type { Collection, WithId, Document } from 'mongodb'

const reconnectMaxTries = 3
const reconnectDelayInMs = 5000

export const mongoHelper = {
  client: null as unknown as MongoClient | null,
  uri: null as unknown as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
    console.log(`Connected to MongoDB at ${uri}`)
  },

  async disconnect (): Promise<void> {
    if (!this.client) throw new Error()
    await this.client.close()
    this.client = null
  },

  async reconnect (uri: string, times: number, delay: number): Promise<boolean> {
    await this.connect(uri)
    if (this.client) return true

    const updatedTimes = times - 1
    if (updatedTimes <= 0) return false

    await setTimeout(delay)
    return await this.reconnect(uri, updatedTimes, delay)
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) await this.reconnect(this.uri, reconnectMaxTries, reconnectDelayInMs)
    if (!this.client) throw new Error()
    return this.client.db().collection(name)
  },

  getMongoUrl (): string {
    if (process.env.NODE_ENV === 'deployment') {
      return process.env.MONGO_REMOTE_URL as string
    }
    if (process.env.MONGO_URL) {
      return process.env.MONGO_URL
    }
    return process.env.MONGO_LOCAL_URL as string
  },

  map (document: WithId<Document> | Document): any {
    const { _id, ...documentWithoutId } = document
    const formattedDocument = {
      id: _id,
      ...documentWithoutId
    }
    return formattedDocument
  },

  mapArray (documents: Array<WithId<Document>> | Document[]): any[] {
    return documents.map(document => this.map(document))
  },

  getUpdateAggregation (surveyId: string, oldAnswer: string, answer: string) {
    return [
      {
        $match: {
          _id: new ObjectId(surveyId)
        }
      },
      {
        $set: {
          answers: {
            $map: {
              input: '$answers',
              in: {
                $cond: {
                  if: {
                    $eq: ['$$this.answer', oldAnswer]
                  },
                  then: {
                    $mergeObjects: [
                      '$$this',
                      {
                        count: {
                          $subtract: ['$$this.count', 1]
                        }
                      }
                    ]
                  },
                  else: '$$this'
                }
              }
            }
          }
        }
      },
      {
        $set: {
          answers: {
            $map: {
              input: '$answers',
              in: {
                $cond: {
                  if: {
                    $eq: ['$$this.answer', oldAnswer]
                  },
                  then: {
                    $mergeObjects: [
                      '$$this',
                      {
                        percent: {
                          $round: [{
                            $multiply: [{
                              $divide: ['$$this.count', '$totalResponses']
                            },
                            100]
                          }, 2]
                        }
                      }
                    ]
                  },
                  else: '$$this'
                }
              }
            }
          }
        }
      },
      {
        $set: {
          answers: {
            $map: {
              input: '$answers',
              in: {
                $cond: {
                  if: {
                    $eq: ['$$this.answer', answer]
                  },
                  then: {
                    $mergeObjects: [
                      '$$this',
                      {
                        count: {
                          $add: ['$$this.count', 1]
                        }
                      }
                    ]
                  },
                  else: '$$this'
                }
              }
            }
          }
        }
      },
      {
        $set: {
          answers: {
            $map: {
              input: '$answers',
              in: {
                $cond: {
                  if: {
                    $eq: ['$$this.answer', answer]
                  },
                  then: {
                    $mergeObjects: [
                      '$$this',
                      {
                        percent: {
                          $round: [{
                            $multiply: [{
                              $divide: ['$$this.count', '$totalResponses']
                            },
                            100]
                          }, 2]
                        }
                      }
                    ]
                  },
                  else: '$$this'
                }
              }
            }
          }
        }
      },
      { $project: { _id: 0 } }
    ]
  },

  getNewAggregation (surveyId: string, answer: string) {
    return [
      {
        $match: {
          _id: new ObjectId(surveyId)
        }
      },
      {
        $set: {
          answers: {
            $map: {
              input: '$answers',
              in: {
                $cond: {
                  if: {
                    $eq: ['$$this.answer', answer]
                  },
                  then: {
                    $mergeObjects: [
                      '$$this',
                      {
                        count: {
                          $add: ['$$this.count', 1]
                        }
                      }
                    ]
                  },
                  else: '$$this'
                }
              }
            }
          },
          totalResponses: {
            $add: ['$totalResponses', 1]
          }
        }
      },
      {
        $set: {
          answers: {
            $map: {
              input: '$answers',
              in: {
                $mergeObjects: [
                  '$$this',
                  {
                    percent: {
                      $round: [{
                        $multiply: [{
                          $divide: ['$$this.count', '$totalResponses']
                        },
                        100]
                      }, 2]
                    }
                  }
                ]
              }
            }
          }
        }
      },
      { $project: { _id: 0 } }
    ]
  },

  getAnsweredAggregation (accountId: string) {
    return [{
      $lookup: {
        from: 'surveyResponses',
        localField: '_id',
        foreignField: 'surveyId',
        as: 'responses'
      }
    },
    {
      $project: {
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        totalResponses: 1,
        answered: {
          $filter: {
            input: '$responses',
            cond: {
              $eq: [
                '$$this.accountId',
                new ObjectId(accountId)
              ]
            }
          }
        }
      }
    },
    {
      $unwind: {
        path: '$answered',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $set: {
        answers: {
          $map: {
            input: '$answers',
            in: {
              $cond: {
                if: {
                  $eq: [
                    '$$this.answer',
                    '$answered.answer'
                  ]
                },
                then: {
                  $mergeObjects: [
                    '$$this',
                    {
                      isCurrentAccountAnswer: true
                    }
                  ]
                },
                else: {
                  $mergeObjects: [
                    '$$this',
                    {
                      isCurrentAccountAnswer: false
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        totalResponses: 1,
        answered: {
          $cond: {
            if: {
              $ifNull: ['$answered', false]
            },
            then: true,
            else: false
          }
        }
      }
    }]
  },

  getSurveyResponseAggregation (accountId: string, surveyId: string) {
    return [{
      $match: {
        accountId: new ObjectId(accountId),
        surveyId: new ObjectId(surveyId)
      }
    }, {
      $facet: {
        matched: [{ $match: {} }]
      }
    }, {
      $project: {
        result: {
          $cond: {
            if: {
              $eq: [{ $size: '$matched' }, 0]
            },
            then: {
              _id: new ObjectId(),
              accountId: new ObjectId(accountId),
              surveyId: new ObjectId(surveyId),
              answer: null,
              date: null
            },
            else: '$matched'
          }
        }
      }
    }, {
      $replaceWith: {
        $mergeObjects: '$result'
      }
    }, {
      $lookup: {
        from: 'surveys',
        localField: 'surveyId',
        foreignField: '_id',
        as: 'survey'
      }
    }, {
      $unwind: {
        path: '$survey',
        preserveNullAndEmptyArrays: true
      }
    }, {
      $match: {
        survey: { $exists: true }
      }
    }, {
      $unset: 'surveyId'
    }, {
      $set: {
        survey: {
          id: '$survey._id',
          _id: '$$REMOVE',
          answers: {
            $map: {
              input: '$survey.answers',
              in: {
                $cond: {
                  if: { $eq: ['$$this.answer', '$answer'] },
                  then: {
                    $mergeObjects: [
                      '$$this', {
                        isCurrentAccountAnswer: true
                      }
                    ]
                  },
                  else: {
                    $mergeObjects: [
                      '$$this', {
                        isCurrentAccountAnswer: false
                      }
                    ]
                  }
                }
              }
            }
          },
          answered: {
            $cond: {
              if: {
                $ifNull: ['$answer', false]
              },
              then: true,
              else: false
            }
          }
        }
      }
    }]
  }
}
