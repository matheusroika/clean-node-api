import type { LoadAccountByToken, Account, Decrypter, LoadAccountByTokenRepository } from './DbLoadAccountByTokenProtocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string | undefined): Promise<Account | null> {
    const token = this.decrypter.decrypt(accessToken)
    if (!token) return null

    await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
    return null
  }
}
