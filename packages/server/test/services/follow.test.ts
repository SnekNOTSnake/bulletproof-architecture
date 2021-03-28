import expect from 'expect'

import UserModel, { IUser } from '../../src/models/User'
import AuthService from '../../src/services/Auth'
import FollowModel from '../../src/models/Follow'
import NotifModel from '../../src/models/Notif'
import FollowService from '../../src/services/Follow'

const Auth = new AuthService(UserModel, NotifModel)
const Follow = new FollowService(FollowModel, UserModel)

let userID1 = ''
let userID2 = ''
let followID1 = ''

describe('FollowService', () => {
	before(async () => {
		const user = await Auth.signup({
			name: 'Follow test user',
			email: 'follow@test.com',
			password: 'somethingcool',
		})
		const user2 = await Auth.signup({
			name: 'Follow test user2',
			email: 'follow2@test.com',
			password: 'somethingcool',
		})

		userID1 = user.id
		userID2 = user2.id
	})

	describe('followUser', () => {
		it('Should be able to create a proper `follow` document as well as increase the `follower` and `following` numbers', async () => {
			const follow = await Follow.followUser({
				follower: userID1,
				following: userID2,
			})
			const user1 = await Auth.getUser(userID1)
			const user2 = await Auth.getUser(userID2)

			if (!user1 || !user2) throw new Error('Users are empty')
			followID1 = follow.id

			expect(follow.id).toBeTruthy()
			expect(String(follow.follower)).toBe(userID1)
			expect(String(follow.following)).toBe(userID2)

			expect(user1.followings).toBe(1)
			expect(user1.followers).toBe(0)
			expect(user2.followings).toBe(0)
			expect(user2.followers).toBe(1)
		})

		it('Should be able to follow back the follower', async () => {
			const follow = await Follow.followUser({
				follower: userID2,
				following: userID1,
			})

			expect(follow.id).toBeTruthy()
		})

		it('Should not be able to follow a user twice', async () => {
			await expect(
				Follow.followUser({ follower: userID1, following: userID2 }),
			).rejects.toThrow()
		})

		it('Should not be able to follow yourself', async () => {
			await expect(
				Follow.followUser({ follower: userID1, following: userID1 }),
			).rejects.toThrow()
		})
	})

	describe('getFollow', () => {
		it('Should be able to get the "following" state of a user', async () => {
			const follow = await Follow.getFollow({
				follower: userID1,
				following: userID2,
			})

			if (!follow) throw new Error('Follow is empty')

			expect(follow.id).toBeTruthy()
		})
	})

	describe('getFollows', () => {
		it('Should be able to get the correct number of reviews', async () => {
			const result = await Follow.getFollows({ first: 2 })
			const result2 = await Follow.getFollows({ first: 5 })

			expect(result[0]).toBeTruthy()
			expect(result).toHaveLength(2)
			expect(result2).toHaveLength(2)
		})

		it('Should be able to get reviews in a correct `created` order', async () => {
			const result = await Follow.getFollows({
				first: 2,
				orderBy: 'created',
				orderType: 'ASC',
			})
			const result2 = await Follow.getFollows({
				first: 2,
				orderBy: 'created',
				orderType: 'DESC',
			})

			expect(String(result[0].id)).toBe(followID1)
			expect(String(result2[1].id)).toBe(followID1)
		})

		it('Should be able to paginate reviews with cursor', async () => {
			const result = await Follow.getFollows({ first: 1 })
			const result2 = await Follow.getFollows({
				first: 1,
				after: result[0].created,
			})
			const result3 = await Follow.getFollows({
				first: 1,
				after: result2[0].created,
			})

			expect(result).toHaveLength(1)
			expect(result2).toHaveLength(1)
			expect(result3).toHaveLength(0)
		})

		it('Should be able to give certain search criteria', async () => {
			const result = await Follow.getFollows({
				first: 2,
				where: { follower: userID1 },
			})
			const result2 = await Follow.getFollows({
				first: 5,
				where: { following: userID2 },
			})

			expect(result).toHaveLength(1)
			expect(result2).toHaveLength(1)
		})
	})

	describe('unfollowUser', () => {
		it('Should be able to delete a `follow` document', async () => {
			await Follow.unfollowUser({ follower: userID1, following: userID2 })
			const follow = await Follow.getFollow({
				follower: userID1,
				following: userID2,
			})

			expect(follow).toBeNull()
		})

		it('Should modify the `following` and `followers` state', async () => {
			await Follow.unfollowUser({ follower: userID2, following: userID1 })
			const user = await Auth.getUser(userID1)

			if (!user) throw new Error('User is empty')

			expect(user.followings).toBe(0)
			expect(user.followers).toBe(0)
		})

		it('Should not be able to abuse `unfollow` user', async () => {
			await Follow.unfollowUser({ follower: userID1, following: userID2 })
			const user = await Auth.getUser(userID1)

			if (!user) throw new Error('User is empty')

			// The states should be the same when there is no `follow` document found
			expect(user.followings).toBe(0)
			expect(user.followers).toBe(0)
		})
	})
})
