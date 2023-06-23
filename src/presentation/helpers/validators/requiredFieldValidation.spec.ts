import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './requiredFieldValidation'

const makeSut = (): RequiredFieldValidation => {
  const sut = new RequiredFieldValidation('anyField')
  return sut
}

describe('Required Field Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ invalidField: '' })
    expect(error).toEqual(new MissingParamError('anyField'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ anyField: 'any' })
    expect(error).toBeFalsy()
  })
})
