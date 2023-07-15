import type { Decrypter } from '@/data/protocols/cryptography/Decrypter'
import type { Encrypter } from '@/data/protocols/cryptography/Encrypter'
import type { HashComparer } from '@/data/protocols/cryptography/HashComparer'
import type { Hasher } from '@/data/protocols/cryptography/Hasher'

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    decrypt (token: string): string | null {
      return 'value'
    }
  }
  return new DecrypterStub()
}

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    encrypt (value: string): string {
      return 'any_token'
    }
  }
  return new EncrypterStub()
}

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return true
    }
  }
  return new HashComparerStub()
}

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('any_password') })
    }
  }
  return new HasherStub()
}
