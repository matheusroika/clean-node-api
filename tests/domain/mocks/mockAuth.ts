import type { AuthAccount, AuthParams, Authentication } from '@/domain/useCases/account/Authentication'

export const mockAuthParams = (): AuthParams => ({
  email: 'any@email.com',
  password: 'any_password'
})

export const mockAuthAccount = (): AuthAccount => ({
  name: 'Any Name',
  email: 'any@email.com',
  accessToken: 'any_token'
})

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authValues: AuthParams): Promise<AuthAccount | null> {
      return mockAuthAccount()
    }
  }
  return new AuthenticationStub()
}
