type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

interface ITokenPayload {
	name: string
	email?: string
	joined: Date
}
