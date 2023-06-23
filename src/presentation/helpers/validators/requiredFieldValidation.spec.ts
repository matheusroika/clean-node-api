import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './requiredFieldValidation'

const makeSut = (): RequiredFieldValidation => {
  const sut = new RequiredFieldValidation('any_field')
  return sut
}

describe('Required Field Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ invalid_field: '' })
    expect(error).toEqual(new MissingParamError('any_field'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ any_field: 'any' })
    expect(error).toBeFalsy()
  })
})
