import type { Account } from '@/domain/models/Account'

export type AuthParams = {
  email: string
  password: string
}

export interface AuthAccount extends Account {
  accessToken: string
}

export interface Authentication {
  auth: (authValues: AuthParams) => Promise<AuthAccount | null>
}
