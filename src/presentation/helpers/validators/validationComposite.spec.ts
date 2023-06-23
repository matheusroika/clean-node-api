import { ValidationComposite } from './validationComposite'
import type { Validation } from './validation'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | undefined {
      return new Error()
    }
  }

  return new ValidationStub()
}

interface Sut {
  sut: ValidationComposite
  validationStub: Validation
}

const makeSut = (): Sut => {
  const validationStub = makeValidation()
  const sut = new ValidationComposite([validationStub])
  return {
    sut,
    validationStub
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({ anyField: 'any' })
    expect(error).toEqual(new Error())
  })
})
