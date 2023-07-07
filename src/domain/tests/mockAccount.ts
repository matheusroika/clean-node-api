import type { Account } from '@/domain/models/Account'
import type { AddAccountParams } from '@/domain/useCases/account/AddAccount'

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'Any Name',
  email: 'any@email.com',
  password: 'any_password'
})

interface AddAccountParamsWithRole extends AddAccountParams {
  role?: string
}

export const mockAddAccountParamsWithRole = (role?: string): AddAccountParamsWithRole => ({
  ...mockAddAccountParams(),
  role
})

export const mockAccount = (): Account => ({
  id: 'any_id',
  name: 'Any Name',
  email: 'any@email.com',
  password: 'hashed_password'
})
