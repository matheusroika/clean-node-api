import type { Account } from '@/domain/models/Account'
import type { AddAccountParams } from '@/domain/useCases/account/AddAccount'

export interface AddAccountRepository {
  add: (account: AddAccountParams) => Promise<Account>
}
