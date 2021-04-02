import { Model } from 'mongoose'
import { Service, Inject } from 'typedi'
import bcrypt from 'bcrypt'
import xss from 'xss'
import { v4 as uuid } from 'uuid'
import { createWriteStream, unlinkSync } from 'fs'
import sharp from 'sharp'

import myEmitter, { USER_SIGNUP } from '../events/events'
import { trim } from '../utils/helpers'
import AppError from '../utils/AppError'
import {
	createAccessToken,
	createRefreshToken,
	decodeToken,
} from '../utils/token'
import { SALT_ROUND } from '../config'
import { INotif } from '../models/Notif'
import { IUser } from '../models/User'

const UPLOAD_DIR = 'public/img/'

@Service()
class AuthService {
	constructor(
		@Inject('usersModel') private UsersModel: Model<IUser>,
		@Inject('notifsModel') private NotifModel: Model<INotif>,
	) {}

	async getUserStats(id: string) {
		const unreadNotifs = await this.NotifModel.countDocuments({
			userTarget: id as any,
			read: false,
		})

		return {
			newNotifs: unreadNotifs,
		}
	}

	async getAuthData(refreshToken: string) {
		const decoded = await decodeToken(refreshToken)
		const user = await this.UsersModel.findById(decoded.userId)

		if (!user) throw new AppError('No user with that ID', 404)

		const { newNotifs } = await this.getUserStats(user.id)

		const newRefreshToken = createRefreshToken(user)
		const accessToken = createAccessToken(user)

		return {
			user,
			accessToken,
			refreshToken: newRefreshToken,
			newNotifs,
		}
	}

	async getUser(id: string) {
		const user = await this.UsersModel.findById(id)
		return user
	}

	async refreshToken(refreshToken: string) {
		const decoded = await decodeToken(refreshToken)
		const user = await this.UsersModel.findById(decoded.userId)

		if (!user) throw new AppError('No user with that ID', 404)

		const newRefreshToken = createRefreshToken(user)
		const accessToken = createAccessToken(user)

		return {
			refreshToken: newRefreshToken,
			accessToken,
		}
	}

	async protect(accessToken: string) {
		const decoded = await decodeToken(accessToken)
		const user = await this.UsersModel.findById(decoded.userId)

		if (!user)
			throw new AppError('No user with that ID, it may have been deleted', 404)

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
		if (existingUser)
			throw new AppError('User with that email already exists', 400)

		const user = new this.UsersModel({
			name: xss(trim(name)),
			email: xss(trim(email)),
			password: encrypted,
		})
		await user.save()

		// Emit user signup event
		myEmitter.emit(USER_SIGNUP, { user })

		return user
	}

	async signin({ email, password }: { email: string; password: string }) {
		const user = await this.UsersModel.findOne({ email })

		if (!user) throw new AppError('No user with that email', 404)
		if (!user.password)
			throw new AppError(
				'User is not using password authentication, they are using either Google or Github',
				400,
			)
		if (!bcrypt.compareSync(password, user.password)) {
			throw new AppError('Incorrect password', 400)
		}

		const { newNotifs } = await this.getUserStats(user.id)

		const refreshToken = createRefreshToken(user)
		const accessToken = createAccessToken(user)

		return {
			refreshToken,
			accessToken,
			newNotifs,
			user,
		}
	}

	static async _upload(file: Promise<GraphQLFileUpload>) {
		const { createReadStream, filename, mimetype } = await file
		const stream = createReadStream()
		const id = uuid()
		const newFilename = id + '.jpg'
		const path = `${UPLOAD_DIR}/${newFilename}`
		const storedFile = { id, filename: newFilename, mimetype, path }

		if (
			!mimetype.startsWith('image/') ||
			!['jpeg', 'png', 'gif'].includes(mimetype.split('/')[1])
		) {
			throw new AppError('Invalid image type. JPEG PNG and GIF only', 400)
		}

		await new Promise((resolve, reject) => {
			const writeStream = createWriteStream(path)

			writeStream.on('finish', resolve)
			writeStream.on('error', (error) => {
				unlinkSync(path)
				reject(new AppError('Something went wrong while processing image', 400))
			})

			stream.on('error', (error) => writeStream.destroy(error))
			stream
				.pipe(
					sharp()
						.flatten({ background: { r: 255, g: 255, b: 255 } })
						.resize(256, 256, { position: 'centre', fit: 'cover' })
						.jpeg({ quality: 85, chromaSubsampling: '4:2:0' })
						.on('error', (err) => {
							stream.destroy(err)
							unlinkSync(path)
							reject(
								new AppError(
									'Something went wrong while processing image',
									400,
								),
							)
						}),
				)
				.pipe(writeStream)
		})

		return storedFile
	}

	async updateMe({
		newName,
		file,
		user,
		bio,
	}: {
		newName: string
		file?: Promise<GraphQLFileUpload> | null
		user: IUser
		bio?: string | null
	}) {
		user.name = xss(trim(newName))
		user.bio = xss(trim(bio ? bio : ''))

		if (file) {
			const uploadResult = await AuthService._upload(file)
			user.avatar = uploadResult.filename
		}

		await user.save()

		return user
	}

	async changePassword({
		user,
		password,
		newPassword,
	}: {
		user: IUser
		password: string
		newPassword: string
	}) {
		if (!user.password)
			throw new AppError('You are not using password authentication', 400)

		if (!bcrypt.compareSync(password, user.password))
			throw new AppError('Incorrect password', 403)

		const encrypted = await bcrypt.hash(newPassword, SALT_ROUND)
		user.password = encrypted

		await user.save()

		return user
	}
}

export default AuthService
