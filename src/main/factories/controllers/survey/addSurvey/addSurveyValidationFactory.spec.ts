import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { makeAddSurveyValidation } from './addSurveyValidationFactory'
import type { Validation } from '@/presentation/protocols/Validation'

jest.mock('../../../../../validation/validators/ValidationComposite')

describe('Add Survey Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const requiredFields = ['question', 'answers']
    const validations: Validation[] = []
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
