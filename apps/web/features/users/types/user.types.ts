export type LifeOSUser = {
  id: string
  email: string
}

export type UserRepository = {
  getCurrent(): Promise<LifeOSUser | null>
  getCurrentId(): Promise<string>
}
