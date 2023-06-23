import type { AuthValues } from '../../../domain/usecases/authentication'
import type { LoadAccountByEmailRepository } from '../../protocols/db/loadAccountByEmailRepository'
import type { HashComparer } from '../../protocols/cryptography/hashComparer'
import type { TokenGenerator } from '../../protocols/cryptography/tokenGenerator'

export class DbAuthentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer, tokenGenerator: TokenGenerator) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
  }

  async auth (authValues: AuthValues): Promise<string | null> {
    const { email, password } = authValues
    const account = await this.loadAccountByEmailRepository.load(email)
    if (!account) return null
    await this.hashComparer.compare(password, account.password)
    await this.tokenGenerator.generate(account.id)
    return null
  }
}
