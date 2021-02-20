type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

interface IUser {
	name: string
	email?: string
	joined: Date
	password?: string
}

interface ITokenPayload extends Omit<IUser, 'password'> {
	id: string
}
