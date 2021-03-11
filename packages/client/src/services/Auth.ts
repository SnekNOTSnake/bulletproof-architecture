import axios from 'axios'

import { setAccessToken, getAccessToken } from '../accessToken'
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

		setAccessToken(res.data.data.accessToken)

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
						setAccessToken(payload.accessToken)
						return resolve(payload.user)
					}
				},
			)
		})
	}

	static async logout(): Promise<void> {
		await axios.post(AUTH_URI + '/logout', {}, { withCredentials: true })
		setAccessToken('')
	}

	/**
	 * Despite the name `refreshToken`, it returns `accessToken`
	 */
	static async refreshToken(): Promise<IAuthData> {
		const res = await axios.post(
			AUTH_URI + '/refresh-token',
			{},
			{ withCredentials: true },
		)
		const data = res.data.data

		setAccessToken(data.accessToken)
		return data
	}

	static async editPassword({
		password,
		newPassword,
	}: {
		password: string
		newPassword: string
	}) {
		const accessToken = getAccessToken()

		const res = await axios.post(
			AUTH_URI + '/change-password',
			{ password, newPassword },
			{
				withCredentials: true,
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			},
		)

		setAccessToken('')

		return res.data.data
	}
}

export default AuthService
