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

declare module '*.svg' {
	const content: any
	export default content
}
