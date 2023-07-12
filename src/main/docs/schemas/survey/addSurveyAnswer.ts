export const addSurveyAnswer = {
  type: 'object',
  properties: {
    image: {
      type: 'string'
    },
    answer: {
      type: 'string'
    }
  },
  required: ['answer']
}
