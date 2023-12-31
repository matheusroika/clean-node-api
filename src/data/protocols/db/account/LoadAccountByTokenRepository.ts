import type { Account } from '@/domain/models/Account'

export interface LoadAccountByTokenRepository {
  loadByToken: (accessToken: string, role?: string) => Promise<Account | null>
}
