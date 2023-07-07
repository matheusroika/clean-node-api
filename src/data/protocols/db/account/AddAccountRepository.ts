import type { Account } from '@/domain/models/Account'
import type { AccountParams } from '@/domain/useCases/account/AddAccount'

export interface AddAccountRepository {
  add: (account: AccountParams) => Promise<Account>
}
