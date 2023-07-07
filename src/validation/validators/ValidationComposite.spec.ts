import { ValidationComposite } from './ValidationComposite'
import { mockValidation } from '@/validation/tests'
import type { Validation } from '@/presentation/protocols'

type Sut = {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): Sut => {
  const validationStubs = [mockValidation(), mockValidation()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    const error = sut.validate({ anyField: 'any' })
    expect(error).toEqual(new Error())
  })

  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new Error('second error'))
    const error = sut.validate({ anyField: 'any' })
    expect(error).toEqual(new Error())
  })

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ anyField: 'any' })
    expect(error).toBeFalsy()
  })
})
