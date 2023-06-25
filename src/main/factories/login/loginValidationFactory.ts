import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import type { Validation } from '../../../presentation/protocols/Validation'
import { EmailValidatorAdapter } from '../../../utils/EmailValidatorAdapter'

export const makeLoginValidation = (): ValidationComposite => {
  const requiredFields = ['email', 'password']
  const validations: Validation[] = []
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
