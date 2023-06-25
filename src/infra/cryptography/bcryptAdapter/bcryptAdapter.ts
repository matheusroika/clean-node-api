import bcrypt from 'bcrypt'
import type { Hasher } from '../../../data/protocols/cryptography/Hasher'
import type { HashComparer } from '../../../data/protocols/cryptography/HashComparer'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (
    private readonly salt: number
  ) {}

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}
