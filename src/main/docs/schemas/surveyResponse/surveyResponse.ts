export const surveyResponse = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    accountId: {
      type: 'string'
    },
    answer: {
      type: 'string'
    },
    date: {
      type: 'string'
    },
    survey: {
      $ref: '#/schemas/survey'
    }
  }
}
