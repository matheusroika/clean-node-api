import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../../validation/validators'
import { makeLoginValidation } from './loginValidationFactory'
import type { Validation } from '../../../../../presentation/protocols/Validation'
import type { EmailValidator } from '../../../../../validation/protocols/EmailValidator'

jest.mock('../../../../../validation/validators/validationComposite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Login Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const requiredFields = ['email', 'password']
    const validations: Validation[] = []
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
