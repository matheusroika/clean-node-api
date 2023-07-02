import type { LoadAccountByToken, Account, Decrypter } from './DbLoadAccountByTokenProtocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter
  ) {}

  async load (accessToken: string, role?: string | undefined): Promise<Account | null> {
    this.decrypter.decrypt(accessToken)
    return null
  }
}
