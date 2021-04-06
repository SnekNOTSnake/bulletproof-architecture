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
const User = new AuthService(UserModel, NotifModel)

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
			const user = await User.signup(testUser)

			expect(user).toBeTruthy()
			expect(user.id).toBeTruthy()
			expect(user.name).toBe(testUser.name)
			expect(user.email).toBe(testUser.email)
			expect(bcrypt.compareSync(testUser.password, user.password!)).toBeTruthy()
		})

		it('Should throw when there is existing user with the same email', async () => {
			await expect(User.signup(testUser)).rejects.toThrow()
		})
	})

	/**
	 * MODIFY THE LOGIN TOKEN AND ID
	 */
	describe('signin', () => {
		it('Should return the user as well as the refreshToken and accessToken', async () => {
			const result = await User.signin(testUser)

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
			const user = await User.protect(accessToken)

			expect(user).toBeTruthy()
			expect(user.id).toBeTruthy()
			expect(user.name).toBe(testUser.name)
			expect(user.email).toBe(testUser.email)
		})

		it('Should throw if token is invalid or empty', async () => {
			const modifiedToken = modifyLastCharacter(accessToken)

			await expect(User.protect('')).rejects.toThrow()
			await expect(User.protect(modifiedToken)).rejects.toThrow()
		})
	})

	describe('refreshToken', () => {
		it('Should return the new `accessToken` and `refreshToken`', async () => {
			const result = await User.refreshToken(refreshToken)
			expect(result).toHaveProperty('accessToken')
			expect(result).toHaveProperty('refreshToken')
		})

		it('Should throws if the token is invalid or empty', async () => {
			const modifiedToken = modifyLastCharacter(refreshToken)
			await expect(User.protect('')).rejects.toThrow()
			await expect(User.refreshToken(modifiedToken)).rejects.toThrow()
		})
	})

	describe('getAuthData', () => {
		before(async () => {
			// Create a test notification
			await NotifModel.create({
				userSender: String(Types.ObjectId()),
				userTarget: loginUserID,
				type: 'FOLLOW',
			})
		})

		it('Should return user as well as total number of new notifications', async () => {
			const user = await User.getUser(loginUserID)
			if (!user) throw new Error('User is empty')
			const result = await User.getAuthData(refreshToken)

			expect(result.accessToken).toBeTruthy()
			expect(result.refreshToken).toBeTruthy()
			expect(result.newNotifs).toBe(1)
			expect(result.user.id).toBe(loginUserID)
		})
	})

	describe('getUser', () => {
		it('Should return the right user', async () => {
			const user: any = await User.getUser(loginUserID)

			expect(user).toBeTruthy()
			expect(user.id).toBeTruthy()
			expect(user.name).toBe(testUser.name)
			expect(user.email).toBe(testUser.email)
		})

		it('Should return null if user is not found', async () => {
			const modifiedID = modifyLastCharacter(loginUserID)

			const user = await User.getUser(modifiedID)

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
			const user = await User.getUser(loginUserID)
			const newBio = 'bio '.repeat(15)
			const newName = 'Glass'

			if (!user) throw new Error('User is undefined')

			const oldAvatar = user.avatar
			const result = await User.updateMe({
				newName,
				user,
				bio: newBio,
			})

			expect(result.name).toBe(newName)
			expect(result.avatar).toBe(oldAvatar)
			expect(result.bio).toBe(newBio)
		})

		it('Should be able to update name as well as updating PFP', async () => {
			const user = await User.getUser(loginUserID)
			const newName = 'Glass2'
			const filename = 'pixiv.jpg'
			const filePath = path.resolve(ASSETS_DIR, filename)

			if (!user) throw new Error('User is undefined')

			const result = await User.updateMe({
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
			const user = await User.getUser(loginUserID)
			const newPassword = 'somethingcooler'

			if (!user) throw new Error('User is undefined')

			const result = await User.changePassword({
				user,
				password: testUser.password,
				newPassword,
			})

			expect(result).toBeTruthy()
			expect(result).toHaveProperty('password')
			expect(bcrypt.compareSync(newPassword, result.password!)).toBe(true)
		})

		it('Should throw when password is incorrect', async () => {
			const user = await User.getUser(loginUserID)
			const newPassword = 'somethingcooler'

			if (!user) throw new Error('User is undefined')

			await expect(
				User.changePassword({
					user,
					password: 'random-password',
					newPassword,
				}),
			).rejects.toThrow()
		})

		it("Should throw when user don't have password (Not using password authentication)", async () => {
			const user = await User.getUser(loginUserID)
			const newPassword = 'somethingcooler'

			if (!user) throw new Error('User is undefined')

			user.password = undefined

			await expect(
				User.changePassword({
					user,
					password: testUser.password,
					newPassword,
				}),
			).rejects.toThrow()
		})
	})

	describe('getUsers', () => {
		it('Should be able to get reviews in a correct `created` order', async () => {
			const newUser = await User.signup({
				email: 'test2@test.com',
				name: 'test user 2',
				password: 'somethingcool',
			})

			const result = await User.getUsers({
				first: 2,
				orderBy: 'created',
				orderType: 'ASC',
			})
			const result2 = await User.getUsers({
				first: 2,
				orderBy: 'created',
				orderType: 'DESC',
			})

			expect(String(result[0].id)).toBe(loginUserID)
			expect(String(result2[0].id)).toBe(String(newUser.id))
		})

		it('Should be able to get the correct number of reviews', async () => {
			const result = await User.getUsers({ first: 1 })
			const result2 = await User.getUsers({ first: 5 })

			expect(result[0]).toBeTruthy()
			expect(result).toHaveLength(1)
			expect(result2).toHaveLength(2)
		})

		it('Should be able to paginate reviews with cursor', async () => {
			const result = await User.getUsers({ first: 1 })
			const result2 = await User.getUsers({
				first: 1,
				after: result[0].created,
			})
			const result3 = await User.getUsers({
				first: 1,
				after: result2[0].created,
			})

			expect(result).toHaveLength(1)
			expect(result2).toHaveLength(1)
			expect(result3).toHaveLength(0)
		})
	})
})
