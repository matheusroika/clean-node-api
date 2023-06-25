import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './CompareFieldsValidation'

const makeSut = (): CompareFieldsValidation => {
  const sut = new CompareFieldsValidation('anyField', 'fieldToCompare')
  return sut
}

describe('Compare Fields Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ anyField: 'any', fieldToCompare: 'invalid' })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ anyField: 'any', fieldToCompare: 'any' })
    expect(error).toBeFalsy()
  })
})
