import type { Account } from '../../../../domain/models/Account'

export interface LoadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<Account | null>
}
