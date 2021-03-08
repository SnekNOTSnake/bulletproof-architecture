import { Model } from 'mongoose'
import { Service, Inject } from 'typedi'
import bcrypt from 'bcrypt'
import xss from 'xss'
import { v4 as uuid } from 'uuid'
import { createWriteStream, unlink } from 'fs'

import {
	createAccessToken,
	createRefreshToken,
	decodeToken,
} from '../utils/token'
import { SALT_ROUND } from '../config'
import { IUser } from '../models/Users'

const UPLOAD_DIR = 'public/img/'

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

	async uploadAvatar({
		file,
		user,
	}: {
		file: Promise<GraphQLFileUpload>
		user: IUser
	}) {
		const { createReadStream, filename, mimetype } = await file
		const stream = createReadStream()
		const id = uuid()
		const newFilename = id + '-' + filename
		const path = `${UPLOAD_DIR}/${newFilename}`
		const storedFile = { id, filename: newFilename, mimetype, path }

		await new Promise((resolve, reject) => {
			const writeStream = createWriteStream(path)

			writeStream.on('finish', resolve)

			writeStream.on('error', (error) => {
				unlink(path, () => {
					reject(error)
				})
			})

			stream.on('error', (error) => writeStream.destroy(error))

			stream.pipe(writeStream)
		})

		user.avatar = newFilename
		await user.save()

		return storedFile
	}
}

export default AuthService
