import axios from 'axios'

const AUTH_URI = 'http://localhost:4200/api/auth'

class AuthService {
	static async login({
		email,
		password,
	}: {
		email: string
		password: string
	}): Promise<{ authData: IAuthData; message: string }> {
		const res = await axios.post(
			AUTH_URI + '/signin',
			{ email, password },
			{ withCredentials: true },
		)

		localStorage.setItem('user', JSON.stringify(res.data.authData))

		return res.data
	}

	static async logout(): Promise<void> {
		await axios.post(AUTH_URI + '/logout', {}, { withCredentials: true })
		localStorage.removeItem('user')
	}

	/**
	 * Despite the name `refreshToken`, it returns `accessToken`
	 */
	static async refreshToken(): Promise<string> {
		const res = await axios.post(
			AUTH_URI + '/refresh-token',
			{},
			{ withCredentials: true },
		)
		localStorage.setItem('user', JSON.stringify(res.data.authData))
		return res.data.authData.accessToken
	}

	static getCurrentUser(): IAuthData | null {
		const data = localStorage.getItem('user')
		if (!data) return null
		return JSON.parse(data)
	}

	static setCurrentUser(authData: IAuthData) {
		localStorage.setItem('user', JSON.stringify(authData))
	}
}

export default AuthService
