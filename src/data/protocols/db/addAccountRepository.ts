import type { AccountValues } from '../../../domain/usecases/addAccount'
import type { Account } from '../../../domain/models/account'

export interface AddAccountRepository {
  add: (account: AccountValues) => Promise<Account>
}
