import { DbLoadAccountByToken } from './DbLoadAccountByToken'
import type { Decrypter } from './DbLoadAccountByTokenProtocols'

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    decrypt (value: string): string {
      return 'decrypted_token'
    }
  }

  return new DecrypterStub()
}

interface Sut {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
}

const makeSut = (): Sut => {
  const decrypterStub = makeDecrypter()
  const sut = new DbLoadAccountByToken(decrypterStub)
  return {
    sut,
    decrypterStub
  }
}

describe('Db Load Account by Token Use Case', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
