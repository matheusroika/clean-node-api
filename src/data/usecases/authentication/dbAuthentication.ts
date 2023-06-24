import type { AuthValues } from '../../../domain/usecases/authentication'
import type { LoadAccountByEmailRepository } from '../../protocols/db/loadAccountByEmailRepository'
import type { HashComparer } from '../../protocols/cryptography/hashComparer'
import type { TokenGenerator } from '../../protocols/cryptography/tokenGenerator'
import type { UpdateAccessTokenRepository } from '../../protocols/db/updateAccessTokenRepository'

export class DbAuthentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authValues: AuthValues): Promise<string | null> {
    const { email, password } = authValues
    const account = await this.loadAccountByEmailRepository.load(email)
    if (!account) return null
    const { password: accountPassword, id } = account
    const isValid = await this.hashComparer.compare(password, accountPassword)
    if (!isValid) return null
    const accessToken = await this.tokenGenerator.generate(id)
    await this.updateAccessTokenRepository.update(id, accessToken)
    return accessToken
  }
}
