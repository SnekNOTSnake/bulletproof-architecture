type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

interface IUser {
	id: string
	name: string
	email?: string
	joined: Date
}

interface IAuthData {
	accessToken: string
	user: IUser
}
