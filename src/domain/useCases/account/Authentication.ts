export type AuthParams = {
  email: string
  password: string
}

export interface Authentication {
  auth: (authValues: AuthParams) => Promise<string | null>
}
