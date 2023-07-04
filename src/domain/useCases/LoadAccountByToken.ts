import type { Account } from '@/domain/models/Account'

export interface LoadAccountByToken {
  load: (accessToken: string, role?: string) => Promise<Account | null>
}
