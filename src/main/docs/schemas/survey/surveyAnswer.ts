export const surveyAnswer = {
  type: 'object',
  properties: {
    image: {
      type: 'string'
    },
    answer: {
      type: 'string'
    },
    count: {
      type: 'number'
    },
    percent: {
      type: 'number'
    },
    isCurrentAccountAnswer: {
      type: 'boolean'
    }
  },
  required: ['answer', 'count', 'percent']
}
