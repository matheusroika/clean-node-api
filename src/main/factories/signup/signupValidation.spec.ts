import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compareFieldsValidation'
import { EmailValidation } from '../../../presentation/helpers/validators/emailValidation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/requiredFieldValidation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validationComposite'
import { makeSignUpValidation } from './signupValidation'
import type { EmailValidator } from '../../../presentation/protocols/emailValidator'
import type { Validation } from '../../../presentation/helpers/validators/validation'

jest.mock('../../../presentation/helpers/validators/validationComposite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Signup Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    const validations: Validation[] = []
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
