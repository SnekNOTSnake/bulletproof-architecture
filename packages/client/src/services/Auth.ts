import axios from 'axios'

import openOAuthWindow from '../utils/openOAuthWindow'

const AUTH_URI = 'http://localhost:4200/api/auth'

class AuthService {
	static async login({
		email,
		password,
	}: {
		email: string
		password: string
	}): Promise<IUser> {
		const res = await axios.post(
			AUTH_URI + '/signin',
			{ email, password },
			{ withCredentials: true },
		)

		localStorage.setItem('user', JSON.stringify(res.data.data))

		return res.data.data.user
	}

	static async signup({
		name,
		email,
		password,
	}: {
		name: string
		email: string
		password: string
	}): Promise<IUser> {
		const res = await axios.post('http://localhost:4200/api/auth/signup', {
			name,
			email,
			password,
		})

		return res.data.data.user
	}

	static oAuthLogin(strategy: 'google' | 'github'): Promise<IUser> {
		return new Promise((resolve, reject) => {
			openOAuthWindow(
				`http://localhost:4200/api/auth/${strategy}`,
				'OAuth Login',
				(message) => {
					const {
						data: { payload, source },
					} = message

					if (
						message.origin === 'http://localhost:4200' &&
						source === 'oauth-login'
					) {
						localStorage.setItem('user', JSON.stringify(payload))
						return resolve(payload.user)
					}
				},
			)
		})
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
		localStorage.setItem('user', JSON.stringify(res.data.data))
		return res.data.data.accessToken
	}

	static getCurrentUser(): IAuthData | null {
		const data = localStorage.getItem('user')
		if (!data) return null
		return JSON.parse(data)
	}
}

export default AuthService
