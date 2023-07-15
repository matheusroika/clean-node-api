import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { makeLoginValidation } from '@/main/factories/controllers/authentication/loginValidationFactory'
import { mockEmailValidator } from '@/../tests/validation/mocks'
import type { Validation } from '@/presentation/protocols/Validation'

jest.mock('@/validation/validators/ValidationComposite')

describe('Login Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const requiredFields = ['email', 'password']
    const validations: Validation[] = []
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', mockEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
