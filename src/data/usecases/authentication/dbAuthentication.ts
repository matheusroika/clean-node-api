import type { AuthValues } from '../../../domain/usecases/authentication'
import type { HashComparer } from '../../protocols/cryptography/hashComparer'
import type { LoadAccountByEmailRepository } from '../../protocols/db/loadAccountByEmailRepository'

export class DbAuthentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async auth (authValues: AuthValues): Promise<string | null> {
    const { email, password } = authValues
    const account = await this.loadAccountByEmailRepository.load(email)
    if (!account) return null
    await this.hashComparer.compare(password, account.password)
    return null
  }
}
