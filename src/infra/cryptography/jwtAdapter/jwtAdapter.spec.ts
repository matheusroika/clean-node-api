import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwtAdapter'

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
  test('Should call jwt.sign with correct values', async () => {
    const { sut } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, secret)
  })

  test('Should return a token on jwt.sign success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })
})
