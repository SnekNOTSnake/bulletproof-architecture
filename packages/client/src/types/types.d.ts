type ArrayElement<A> = A extends readonly (infer T)[] ? T : never

interface IUser {
	id: string
	name: string
	email?: string | null
	joined: Date
	avatar: string
	bio?: string | null
}

interface IAuthData {
	accessToken: string
	user: IUser
}

declare module '*.svg' {
	const content: any
	export default content
}
