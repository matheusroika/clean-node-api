import { EmailValidatorAdapter } from '@/infra/validators/EmailValidatorAdapter'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import type { Validation } from '@/presentation/protocols/Validation'

export const makeLoginValidation = (): ValidationComposite => {
  const requiredFields = ['email', 'password']
  const validations: Validation[] = []
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
