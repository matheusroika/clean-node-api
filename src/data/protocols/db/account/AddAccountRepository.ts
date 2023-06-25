import type { AccountValues } from '../../../../domain/usecases/AddAccount'
import type { Account } from '../../../../domain/models/Account'

export interface AddAccountRepository {
  add: (account: AccountValues) => Promise<Account>
}
