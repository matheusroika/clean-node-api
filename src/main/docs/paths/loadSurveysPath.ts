export const loadSurveysPath = {
  get: {
    tags: ['Survey'],
    summary: 'API para listar todas as enquetes',
    security: [{
      apiKeyAuth: []
    }],
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
      },
      204: {
        description: 'Sucesso. Não há conteúdo'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
