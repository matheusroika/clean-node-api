import type { Account } from '@/domain/models/Account'
import type { AddAccountParams } from '@/domain/useCases/account/AddAccount'

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'Any Name',
  email: 'any@email.com',
  password: 'any_password'
})

export const mockAccount = (): Account => ({
  id: 'any_id',
  name: 'Any Name',
  email: 'any@email.com',
  password: 'hashed_password'
})
