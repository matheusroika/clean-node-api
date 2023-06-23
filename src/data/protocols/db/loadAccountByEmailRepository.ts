import type { Account } from '../../../domain/models/account'

export interface LoadAccountByEmailRepository {
  load: (email: string) => Promise<Account | null>
}
