import type { AuthParams, Authentication } from '@/domain/useCases/account/Authentication'

export const mockAuthParams = (): AuthParams => ({
  email: 'any@email.com',
  password: 'any_password'
})

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authValues: AuthParams): Promise<string | null> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
}
