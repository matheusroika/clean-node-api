import { RequiredFieldValidation } from '../../presentation/helpers/validators/requiredFieldValidation'
import { ValidationComposite } from '../../presentation/helpers/validators/validationComposite'
import type { Validation } from '../../presentation/helpers/validators/validation'

export const makeSignUpValidation = (): ValidationComposite => {
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  const validations: Validation[] = []
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
