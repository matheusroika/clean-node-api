import { EmailValidatorAdapter } from './emailValidatorAdapter'

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid@email.com')
    expect(isValid).toBe(false)
  })
})
