import type { Account } from '@/domain/models/Account'
import type { AccountValues } from '@/domain/useCases/AddAccount'

export interface AddAccountRepository {
  add: (account: AccountValues) => Promise<Account>
}
