export type AuthParams = {
  email: string
  password: string
}

export interface AuthAccount {
  name: string
  email: string
  accessToken: string
}

export interface Authentication {
  auth: (authValues: AuthParams) => Promise<AuthAccount | null>
}
