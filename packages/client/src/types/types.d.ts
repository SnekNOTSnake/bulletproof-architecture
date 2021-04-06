type ArrayElement<A> = A extends readonly (infer T)[] ? T : never

interface IUser {
	id: string
	name: string
	email?: string | null
	created: Date
	avatar: string
	bio?: string | null
}

interface IAuthData {
	accessToken: string
	user: IUser
	newNotifs: number
}

declare module '*.svg' {
	const content: any
	export default content
}
