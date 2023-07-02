import type { Account } from '../models/Account'

export interface LoadAccountByToken {
  load: (accessToken: string, role?: string) => Promise<Account | null>
}
