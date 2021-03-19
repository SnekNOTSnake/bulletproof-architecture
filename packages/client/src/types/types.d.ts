type ArrayElement<A> = A extends readonly (infer T)[] ? T : never

interface IUser {
	id: string
	name: string
	email?: string
	joined: Date
	avatar: string
}

interface IAuthData {
	accessToken: string
	user: IUser
}

declare module '*.svg' {
	const content: any
	export default content
}
