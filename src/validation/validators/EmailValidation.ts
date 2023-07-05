import { InvalidParamError } from '@/presentation/errors'
import type { Validation } from '@/presentation/protocols'
import type { EmailValidator } from '@/validation/protocols/EmailValidator'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error | undefined {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
