import expect from 'expect'
import bcrypt from 'bcrypt'
import { createReadStream, existsSync, unlinkSync } from 'fs'
import path from 'path'
import { Types } from 'mongoose'

import { modifyLastCharacter } from '../utils'
import NotifModel from '../../src/models/Notif'
import UserModel from '../../src/models/User'
import AuthService from '../../src/services/Auth'

const ASSETS_DIR = path.join(__dirname, '../assets')
const UPLOAD_DIR = path.join(__dirname, '../../public/img')
const authServiceInstance = new AuthService(UserModel, NotifModel)

export const testUser = {
	name: 'test',
	email: 'test@test.com',
	password: 'somethingcool',
	avatar: 'default.jpg',
}

describe('Auth Service', function () {
	let refreshToken = ''
	let accessToken = ''
	let loginUserID = ''

	describe('signup', () => {
		it('Should return the same user, with an additional ID field, and encrypted password', async () => {
			const user = await authServiceInstance.signup(testUser)

			expect(user).toBeTruthy()
			expect(user.id).toBeTruthy()
			expect(user.name).toBe(testUser.name)
			expect(user.email).toBe(testUser.email)
			expect(bcrypt.compareSync(testUser.password, user.password!)).toBeTruthy()
		})

		it('Should throw when there is existing user with the same email', async () => {
			await expect(authServiceInstance.signup(testUser)).rejects.toThrow()
		})
	})

	/**
	 * MODIFY THE LOGIN TOKEN AND ID
	 */
	describe('signin', () => {
		it('Should return the user as well as the refreshToken and accessToken', async () => {
			const result = await authServiceInstance.signin(testUser)

			refreshToken = result.refreshToken
			accessToken = result.accessToken
			loginUserID = result.user.id

			expect(result).toBeTruthy()
			expect(result.refreshToken).toBeTruthy()
			expect(result.accessToken).toBeTruthy()
			expect(result.user).toBeTruthy()

			expect(result.user).toBeTruthy()
			expect(result.user.id).toBeTruthy()
			expect(result.user.name).toBe(testUser.name)
			expect(result.user.email).toBe(testUser.email)
		})
	})

	describe('protect', () => {
		it('Should return logged in user if token is valid', async () => {
			const user = await authServiceInstance.protect(accessToken)

			expect(user).toBeTruthy()
			expect(user.id).toBeTruthy()
			expect(user.name).toBe(testUser.name)
			expect(user.email).toBe(testUser.email)
		})

		it('Should throw if token is invalid or empty', async () => {
			const modifiedToken = modifyLastCharacter(accessToken)

			await expect(authServiceInstance.protect('')).rejects.toThrow()
			await expect(authServiceInstance.protect(modifiedToken)).rejects.toThrow()
		})
	})

	describe('refreshToken', () => {
		it('Should return the new `accessToken` and `refreshToken`', async () => {
			const result = await authServiceInstance.refreshToken(refreshToken)
			expect(result).toHaveProperty('accessToken')
			expect(result).toHaveProperty('refreshToken')
		})

		it('Should throws if the token is invalid or empty', async () => {
			const modifiedToken = modifyLastCharacter(refreshToken)
			await expect(authServiceInstance.protect('')).rejects.toThrow()
			await expect(
				authServiceInstance.refreshToken(modifiedToken),
			).rejects.toThrow()
		})
	})

	describe('getAuthData', () => {
		before(async () => {
			// Create a test notification
			await NotifModel.create({
				userSender: String(Types.ObjectId()),
				userTarget: loginUserID,
				follow: String(Types.ObjectId()),
			})
		})

		it('Should return user as well as total number of new notifications', async () => {
			const user = await authServiceInstance.getUser(loginUserID)
			if (!user) throw new Error('User is empty')
			const result = await authServiceInstance.getAuthData(refreshToken)

			expect(result.accessToken).toBeTruthy()
			expect(result.refreshToken).toBeTruthy()
			expect(result.newNotifs).toBe(1)
			expect(result.user.id).toBe(loginUserID)
		})
	})

	describe('getUser', () => {
		it('Should return the right user', async () => {
			const user: any = await authServiceInstance.getUser(loginUserID)

			expect(user).toBeTruthy()
			expect(user.id).toBeTruthy()
			expect(user.name).toBe(testUser.name)
			expect(user.email).toBe(testUser.email)
		})

		it('Should return null if user is not found', async () => {
			const modifiedID = modifyLastCharacter(loginUserID)

			const user = await authServiceInstance.getUser(modifiedID)

			expect(user).toBeNull()
		})
	})

	describe('_upload', () => {
		it("Should be able to upload images, store it in the FS, and change user's avatar document field", async () => {
			const filename = 'pixiv.jpg'
			const filePath = path.resolve(ASSETS_DIR, filename)

			const result = await AuthService._upload(
				new Promise((resolve, reject) => {
					resolve({
						createReadStream: () => createReadStream(filePath),
						filename,
						mimetype: 'image/jpeg',
						encoding: '7bit',
					})
				}),
			)

			expect(existsSync(result.path)).toBe(true)
			unlinkSync(result.path)
		})

		it('Should be able to upload png images', async () => {
			const filename = 'myanimelist.png'
			const filePath = path.resolve(ASSETS_DIR, filename)

			const result = await AuthService._upload(
				new Promise((resolve, reject) => {
					resolve({
						createReadStream: () => createReadStream(filePath),
						filename,
						mimetype: 'image/jpeg',
						encoding: '7bit',
					})
				}),
			)

			expect(existsSync(result.path)).toBe(true)
			unlinkSync(result.path)
		})

		it('Should throw when dealing with unknown file extensions', async () => {
			const filename = 'danganronpa.torrent'
			const filePath = path.resolve(ASSETS_DIR, filename)

			await expect(
				AuthService._upload(
					new Promise((resolve, reject) => {
						resolve({
							createReadStream: () => createReadStream(filePath),
							filename,
							mimetype: 'image/jpeg',
							encoding: '7bit',
						})
					}),
				),
			).rejects.toThrow()
		})

		it('Should throw when dealing with suspicious images (images that claim to be images)', async () => {
			const filename = 'fake-image.jpg'
			const filePath = path.resolve(ASSETS_DIR, filename)

			await expect(
				AuthService._upload(
					new Promise((resolve, reject) => {
						resolve({
							createReadStream: () => createReadStream(filePath),
							filename,
							mimetype: 'image/jpeg',
							encoding: '7bit',
						})
					}),
				),
			).rejects.toThrow()
		})
	})

	describe('updateMe', () => {
		it('Should be able to update name without updating PFP', async () => {
			const user = await authServiceInstance.getUser(loginUserID)
			const newBio = 'bio '.repeat(15)
			const newName = 'Glass'

			if (!user) throw new Error('User is undefined')

			const oldAvatar = user.avatar
			const result = await authServiceInstance.updateMe({
				newName,
				user,
				bio: newBio,
			})

			expect(result.name).toBe(newName)
			expect(result.avatar).toBe(oldAvatar)
			expect(result.bio).toBe(newBio)
		})

		it('Should be able to update name as well as updating PFP', async () => {
			const user = await authServiceInstance.getUser(loginUserID)
			const newName = 'Glass2'
			const filename = 'pixiv.jpg'
			const filePath = path.resolve(ASSETS_DIR, filename)

			if (!user) throw new Error('User is undefined')

			const result = await authServiceInstance.updateMe({
				newName,
				file: new Promise((resolve, reject) => {
					resolve({
						createReadStream: () => createReadStream(filePath),
						filename,
						mimetype: 'image/jpeg',
						encoding: '7bit',
					})
				}),
				user,
			})

			expect(result.name).toBe(newName)
			expect(result.avatar).toBeTruthy()
			expect(existsSync(path.resolve(UPLOAD_DIR, result.avatar))).toBe(true)
			unlinkSync(path.resolve(UPLOAD_DIR, result.avatar))
		})
	})

	describe('changePassword', () => {
		it("Should be able to change user's password", async () => {
			const user = await authServiceInstance.getUser(loginUserID)
			const newPassword = 'somethingcooler'

			if (!user) throw new Error('User is undefined')

			const result = await authServiceInstance.changePassword({
				user,
				password: testUser.password,
				newPassword,
			})

			expect(result).toBeTruthy()
			expect(result).toHaveProperty('password')
			expect(bcrypt.compareSync(newPassword, result.password!)).toBe(true)
		})

		it('Should throw when password is incorrect', async () => {
			const user = await authServiceInstance.getUser(loginUserID)
			const newPassword = 'somethingcooler'

			if (!user) throw new Error('User is undefined')

			await expect(
				authServiceInstance.changePassword({
					user,
					password: 'random-password',
					newPassword,
				}),
			).rejects.toThrow()
		})

		it("Should throw when user don't have password (Not using password authentication)", async () => {
			const user = await authServiceInstance.getUser(loginUserID)
			const newPassword = 'somethingcooler'

			if (!user) throw new Error('User is undefined')

			user.password = undefined

			await expect(
				authServiceInstance.changePassword({
					user,
					password: testUser.password,
					newPassword,
				}),
			).rejects.toThrow()
		})
	})
})
