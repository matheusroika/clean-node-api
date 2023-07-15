import type { LoadAccountByToken, Account, Decrypter, LoadAccountByTokenRepository } from './DbLoadAccountByTokenProtocols'

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
