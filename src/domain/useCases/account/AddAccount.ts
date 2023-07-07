import type { Account } from '@/domain/models/Account'

export type AddAccountParams = {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add: (account: AddAccountParams) => Promise<Account | null>
}
