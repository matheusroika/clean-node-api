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

describe('JSON Web Token Adapter', () => {
  test('Should call jwt.sign with correct values', async () => {
    const { sut } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, secret)
  })
})
