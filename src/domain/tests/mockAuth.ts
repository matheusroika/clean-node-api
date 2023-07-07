import type { AuthParams } from '@/domain/useCases/account/Authentication'

export const mockAuthParams = (): AuthParams => ({
  email: 'any@email.com',
  password: 'any_password'
})
