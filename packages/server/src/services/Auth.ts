import { Model } from 'mongoose'
import { Service, Inject } from 'typedi'
import bcrypt from 'bcrypt'
import xss from 'xss'

import {
	createAccessToken,
	createRefreshToken,
	decodeToken,
} from '../utils/token'
import { SALT_ROUND } from '../config'
import { IUser } from '../models/Users'

@Service()
class AuthService {
	constructor(@Inject('usersModel') private UsersModel: Model<IUser>) {}

	async getUser(id: string) {
		const user = await this.UsersModel.findById(id)
		return user
	}

	async refreshToken(refreshToken: string) {
		const decoded = await decodeToken(refreshToken)
		const user = await this.UsersModel.findById(decoded.userId)

		if (!user) throw new Error('No user with that ID')

		const newRefreshToken = createRefreshToken(user)
		const accessToken = createAccessToken(user)

		return {
			refreshToken: newRefreshToken,
			accessToken,
			user,
		}
	}

	async protect(accessToken: string) {
		const decoded = await decodeToken(accessToken)
		const user = await this.UsersModel.findById(decoded.userId)

		if (!user) throw new Error('No user with that ID, it may have been deleted')

		return user
	}

	async signup({
		name,
		email,
		password,
	}: {
		name: string
		email: string
		password: string
	}) {
		const encrypted = await bcrypt.hash(password, SALT_ROUND)

		const existingUser = await this.UsersModel.findOne({ email })
		if (existingUser) throw new Error('User with that email already exists')

		const user = new this.UsersModel({
			name: xss(name),
			email: xss(email),
			password: encrypted,
		})
		await user.save()

		return user
	}

	async signin({ email, password }: { email: string; password: string }) {
		const user = await this.UsersModel.findOne({ email })

		if (!user) throw new Error('No user with that email')
		if (!user.password)
			throw new Error(
				'User is not using password authentication, they are using either Google or Github',
			)
		if (!bcrypt.compareSync(password, user.password)) {
			throw new Error('Incorrect password')
		}

		const refreshToken = createRefreshToken(user)
		const accessToken = createAccessToken(user)

		return {
			refreshToken,
			accessToken,
			user,
		}
	}
}

export default AuthService
