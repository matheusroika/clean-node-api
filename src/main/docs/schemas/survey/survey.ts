export const survey = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    question: {
      type: 'string'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswer'
      }
    },
    totalResponses: {
      type: 'number'
    },
    date: {
      type: 'string'
    },
    answered: {
      type: 'boolean'
    }
  },
  required: ['id', 'question', 'answers', 'totalResponses', 'date']
}
