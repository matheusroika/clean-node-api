import type { AuthValues } from '../../../domain/usecases/authentication'
import type { LoadAccountByEmailRepository } from '../../protocols/loadAccountByEmailRepository'

export class DbAuthentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth (authValues: AuthValues): Promise<string | null> {
    await this.loadAccountByEmailRepository.load(authValues.email)
    return null
  }
}
