import type { Account } from '@/domain/models/Account'
import type { LoadAccountByToken } from '@/domain/useCases/account/LoadAccountByToken'
import type { Decrypter } from '@/data/protocols/cryptography/Decrypter'
import type { LoadAccountByTokenRepository } from '@/data/protocols/db/account/LoadAccountByTokenRepository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<Account | null> {
    let token: string | null
    try {
      token = this.decrypter.decrypt(accessToken)
    } catch (error) {
      return null
    }
    if (!token) return null

    const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
    return account
  }
}
