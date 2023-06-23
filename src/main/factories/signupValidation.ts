import { RequiredFieldValidation } from '../../presentation/helpers/validators/requiredFieldValidation'
import { ValidationComposite } from '../../presentation/helpers/validators/validationComposite'
import { CompareFieldsValidation } from '../../presentation/helpers/validators/compareFieldsValidation'
import { EmailValidation } from '../../presentation/helpers/validators/emailValidation'
import { EmailValidatorAdapter } from '../../utils/emailValidatorAdapter'
import type { Validation } from '../../presentation/helpers/validators/validation'

export const makeSignUpValidation = (): ValidationComposite => {
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  const validations: Validation[] = []
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
