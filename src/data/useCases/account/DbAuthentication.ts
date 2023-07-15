import type { AuthAccount, AuthParams, Authentication } from '@/domain/useCases/account/Authentication'
import type { LoadAccountByEmailRepository } from '@/data/protocols/db/account/LoadAccountByEmailRepository'
import type { HashComparer } from '@/data/protocols/cryptography/HashComparer'
import type { Encrypter } from '@/data/protocols/cryptography/Encrypter'
import type { UpdateAccessTokenRepository } from '@/data/protocols/db/account/UpdateAccessTokenRepository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authValues: AuthParams): Promise<AuthAccount | null> {
    const { email, password } = authValues
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!account) return null
    const { password: accountPassword, id } = account
    const isValid = await this.hashComparer.compare(password, accountPassword)
    if (!isValid) return null
    const accessToken = this.encrypter.encrypt(id)
    await this.updateAccessTokenRepository.updateAccessToken(id, accessToken)
    return {
      name: account.name,
      email: account.email,
      accessToken
    }
  }
}
