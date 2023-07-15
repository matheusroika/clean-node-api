import jwt from 'jsonwebtoken'
import { JwtAdapter } from '@/infra/cryptography/JwtAdapter'

type Sut = {
  sut: JwtAdapter
}

const secret = 'secret'
const isKey = false
const makeSut = (): Sut => {
  const sut = new JwtAdapter(secret, isKey)
  return {
    sut
  }
}

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'any_token'
  },
  verify (): string {
    return 'any_value'
  }
}))

describe('JSON Web Token Adapter', () => {
  describe('jwt.sign', () => {
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

  describe('jwt.verify', () => {
    test('Should call jwt.verify with correct values', () => {
      const { sut } = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', secret)
    })

    test('Should return a value on jwt.verify success', () => {
      const { sut } = makeSut()
      const value = sut.decrypt('any_token')
      expect(value).toBe('any_value')
    })

    test('Should throw if jwt.verify throws', () => {
      const { sut } = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error() })
      expect(() => { sut.decrypt('any_token') }).toThrow()
    })
  })
})
