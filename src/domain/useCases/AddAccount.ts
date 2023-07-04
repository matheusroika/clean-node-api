import type { Account } from '@/domain/models/Account'

export interface AccountValues {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add: (account: AccountValues) => Promise<Account | null>
}
