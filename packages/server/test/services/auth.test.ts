import expect from 'expect'
import bcrypt from 'bcrypt'
import { modifyLastCharacter } from '../utils'
import UserModel from '../../src/models/Users'
import AuthService from '../../src/services/Auth'

const authServiceInstance = new AuthService(UserModel)

export const testUser = {
	name: 'test',
	email: 'test@test.com',
	password: 'somethingcool',
}

describe('Auth Service', function () {
	let loginToken = ''
	let loginUserID = ''

	describe('signup', () => {
		it('Should return the same user, with an additional ID field, and encrypted password', async () => {
			const user = await authServiceInstance.signup(testUser)

			expect(user).toBeTruthy()
			expect(user.id).toBeTruthy()
			expect(user.name).toBe(testUser.name)
			expect(user.email).toBe(testUser.email)
			expect(bcrypt.compareSync(testUser.password, user.password)).toBeTruthy()
		})

		it('Should throw when there is existing user with the same email', async () => {
			await expect(authServiceInstance.signup(testUser)).rejects.toThrow()
		})
	})

	/**
	 * MODIFY THE LOGIN TOKEN AND ID
	 */
	describe('signin', () => {
		it('Should return the user as well as the JWT token and cookie expiration time', async () => {
			const result = await authServiceInstance.signin(testUser)
			loginToken = result.token
			loginUserID = result.user.id

			expect(result).toBeTruthy()
			expect(result.token).toBeTruthy()
			expect(result.tokenExpiration).toBeTruthy()

			expect(result.user).toBeTruthy()
			expect(result.user.id).toBeTruthy()
			expect(result.user.name).toBe(testUser.name)
			expect(result.user.email).toBe(testUser.email)
		})
	})

	describe('protect', () => {
		it('Should return logged in user if token is valid', async () => {
			const user = await authServiceInstance.protect(loginToken)

			expect(user).toBeTruthy()
			expect(user.id).toBeTruthy()
			expect(user.name).toBe(testUser.name)
			expect(user.email).toBe(testUser.email)
		})

		it('Should throw if token is invalid or empty', async () => {
			const modifiedToken = modifyLastCharacter(loginToken)

			await expect(authServiceInstance.protect('')).rejects.toThrow()
			await expect(authServiceInstance.protect(modifiedToken)).rejects.toThrow()
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
})
