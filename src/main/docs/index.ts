import paths from './paths'
import schemas from './schemas'
import components from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'Uma API em Node usando TDD, Clean Architecture, SOLID e Design Patterns, para realizar enquetes',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Authentication'
  },
  {
    name: 'Survey'
  }],
  paths,
  schemas,
  components
}
