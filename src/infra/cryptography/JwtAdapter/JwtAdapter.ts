import jwt from 'jsonwebtoken'
import type { Secret } from 'jsonwebtoken'
import type { Encrypter } from '../../../data/protocols/cryptography/Encrypter'
import type { Decrypter } from '../../../data/protocols/cryptography/Decrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (
    private readonly secret: Secret,
    private readonly isKey: boolean
  ) {}

  encrypt (value: string): string {
    const accessToken = this.isKey
      ? jwt.sign({ id: value }, this.secret, { algorithm: 'RS256' })
      : jwt.sign({ id: value }, this.secret)
    return accessToken
  }

  decrypt (value: string): string | null {
    jwt.verify(value, this.secret)
    return ''
  }
}
