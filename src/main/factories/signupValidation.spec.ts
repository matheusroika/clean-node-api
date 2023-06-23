import { RequiredFieldValidation } from '../../presentation/helpers/validators/requiredFieldValidation'
import type { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validationComposite'
import { makeSignUpValidation } from './signupValidation'

jest.mock('../../presentation/helpers/validators/validationComposite')

describe('Signup Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    const validations: Validation[] = []
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
