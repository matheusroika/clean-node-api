import { RequiredFieldValidation } from '../../../presentation/helpers/validators/requiredFieldValidation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validationComposite'
import { EmailValidation } from '../../../presentation/helpers/validators/emailValidation'
import { EmailValidatorAdapter } from '../../../utils/emailValidatorAdapter'
import type { Validation } from '../../../presentation/helpers/validators/validation'

export const makeLoginValidation = (): ValidationComposite => {
  const requiredFields = ['email', 'password']
  const validations: Validation[] = []
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
