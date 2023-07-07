import type { Account } from '@/domain/models/Account'

export type AccountParams = {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add: (account: AccountParams) => Promise<Account | null>
}
