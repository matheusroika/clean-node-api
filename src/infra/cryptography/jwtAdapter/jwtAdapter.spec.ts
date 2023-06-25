import jwt from 'jsonwebtoken'
import { JwtAdapter } from './JwtAdapter'

interface Sut {
  sut: JwtAdapter
}

const secret = 'secret'
const makeSut = (): Sut => {
  const sut = new JwtAdapter(secret)
  return {
    sut
  }
}

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'any_token'
  }
}))

describe('JSON Web Token Adapter', () => {
  test('Should call jwt.sign with correct values', () => {
    const { sut } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, secret)
  })

  test('Should return a token on jwt.sign success', () => {
    const { sut } = makeSut()
    const accessToken = sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })

  test('Should throw if jwt.sign throws', () => {
    const { sut } = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
    expect(() => { sut.encrypt('any_id') }).toThrow()
  })
})
