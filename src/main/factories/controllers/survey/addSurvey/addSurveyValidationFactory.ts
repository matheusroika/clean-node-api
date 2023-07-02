import { RequiredFieldValidation, ValidationComposite } from '../../../../../validation/validators'
import type { Validation } from '../../../../../presentation/protocols/Validation'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const requiredFields = ['question', 'answers']
  const validations: Validation[] = []
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
