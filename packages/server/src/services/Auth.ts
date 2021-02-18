import { Model } from 'mongoose'
import { Service, Inject } from 'typedi'
import bcrypt from 'bcrypt'
import { createToken, decodeToken } from '../utils/token'
import { SALT_ROUND, JWT_COOKIE_EXPIRES_IN } from '../config'
import { IUser, DocumentUser } from '../models/Users'

@Service()
class AuthService {
	constructor(@Inject('usersModel') private UsersModel: Model<DocumentUser>) {}

	async getUser(id: string) {
		const user = await this.UsersModel.findById(id)
		return user
	}

	async protect(token: string) {
		const decoded = await decodeToken(token)
		const user = await this.UsersModel.findById(decoded.id)

		if (!user) throw new Error('No user with that ID, it may have been deleted')

		return user
	}

	async signup({
		name,
		email,
		password,
	}: Pick<IUser, 'name' | 'email' | 'password'>) {
		const encrypted = await bcrypt.hash(password, SALT_ROUND)

		const existingUser = await this.UsersModel.findOne({ email })
		if (existingUser) throw new Error('User with that email already exists')

		const user = new this.UsersModel({ name, email, password: encrypted })
		await user.save()

		return user
	}

	async signin({ email, password }: Pick<IUser, 'email' | 'password'>) {
		const user = await this.UsersModel.findOne({ email })

		if (!user) throw new Error('No user with that email')
		if (!bcrypt.compareSync(password, user.password)) {
			throw new Error('Incorrect password')
		}

		const token = await createToken(user)

		return {
			token,
			tokenExpiration: JWT_COOKIE_EXPIRES_IN,
			user,
		}
	}
}

export default AuthService
