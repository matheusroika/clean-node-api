export interface AuthValues {
  email: string
  password: string
}

export interface Authentication {
  auth: (authValues: AuthValues) => Promise<string | null>
}
