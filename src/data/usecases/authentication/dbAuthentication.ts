import type { AuthValues, HashComparer, LoadAccountByEmailRepository, Encrypter, UpdateAccessTokenRepository } from './DbAuthenticationProtocols'

export class DbAuthentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly encrypter: Encrypter
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.encrypter = encrypter
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authValues: AuthValues): Promise<string | null> {
    const { email, password } = authValues
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!account) return null
    const { password: accountPassword, id } = account
    const isValid = await this.hashComparer.compare(password, accountPassword)
    if (!isValid) return null
    const accessToken = this.encrypter.encrypt(id)
    await this.updateAccessTokenRepository.updateAccessToken(id, accessToken)
    return accessToken
  }
}
