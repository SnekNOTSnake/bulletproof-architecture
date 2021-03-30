import { Service, Inject } from 'typedi'
import { Model } from 'mongoose'
import { ObjectId } from 'mongodb'

import AppError from '../utils/AppError'
import { IFollow } from '../models/Follow'
import { IUser } from '../models/User'
import { INotif } from '../models/Notif'
import { compactMap, getFilterings } from '../utils/helpers'

@Service()
class FollowService {
	constructor(
		@Inject('followsModel') private FollowsModel: Model<IFollow>,
		@Inject('usersModel') private UsersModel: Model<IUser>,
		@Inject('notifsModel') private NotifsModel: Model<INotif>,
	) {}

	async _notifyFollowedUser(userSender: string, userTarget: string) {
		this.NotifsModel.create({
			userSender,
			userTarget,
			type: 'FOLLOW',
		})
	}

	async followUser({
		follower,
		following,
	}: {
		follower: string
		following: string
	}) {
		// Prevent self-following
		if (String(follower) === String(following))
			throw new AppError('You cannot follow yourself', 400)

		const userToFollow = await this.UsersModel.findById(following)
		if (!userToFollow) throw new AppError('No user with that ID', 404)

		const follow = await this.FollowsModel.create({ follower, following })

		await this.UsersModel.bulkWrite([
			{
				updateOne: {
					filter: { _id: new ObjectId(follower) },
					update: { $inc: { followings: 1 } },
				},
			},
			{
				updateOne: {
					filter: { _id: new ObjectId(following) },
					update: { $inc: { followers: 1 } },
				},
			},
		])

		this._notifyFollowedUser(follower, following)

		return follow
	}

	async unfollowUser({
		follower,
		following,
	}: {
		follower: string
		following: string
	}) {
		const follow = await this.FollowsModel.findOneAndDelete({
			follower: follower as any,
			following: following as any,
		})

		// Prevent unfollow abuse
		if (!follow) return follow

		await this.UsersModel.bulkWrite([
			{
				updateOne: {
					filter: { _id: new ObjectId(follower) },
					update: { $inc: { followings: -1 } },
				},
			},
			{
				updateOne: {
					filter: { _id: new ObjectId(following) },
					update: { $inc: { followers: -1 } },
				},
			},
		])

		// Delete associated notifs
		await this.NotifsModel.deleteMany({
			type: 'FOLLOW',
			userSender: follower as any,
			userTarget: following as any,
		})

		return follow
	}

	async getFollow({
		follower,
		following,
	}: {
		follower: string
		following: string
	}) {
		const follow = await this.FollowsModel.findOne({
			follower: follower as any,
			following: following as any,
		})

		return follow
	}

	async getFollows({
		first,
		after,
		orderBy = 'created',
		orderType = 'DESC',
		where,
	}: {
		first: number
		after?: string | Date | null
		orderBy?: 'created'
		orderType?: 'ASC' | 'DESC'
		where?: {
			follower?: any
			following?: any
		} | null
	}) {
		const { limit, sort, filter } = await getFilterings(this.FollowsModel, {
			first,
			after,
			orderBy,
			orderType,
		})

		const follows = await this.FollowsModel.find({
			...compactMap(where || {}),
			...(filter || {}),
		})
			.sort(sort)
			.limit(limit)
			.exec()

		return follows
	}
}

export default FollowService
