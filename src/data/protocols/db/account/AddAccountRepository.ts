import type { AccountValues } from '@/domain/useCases/AddAccount'
import type { Account } from '@/domain/models/Account'

export interface AddAccountRepository {
  add: (account: AccountValues) => Promise<Account>
}
