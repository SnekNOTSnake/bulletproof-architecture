import { Service, Inject } from 'typedi'
import { Model } from 'mongoose'

import AppError from '../utils/AppError'
import { IFollow } from '../models/Follow'
import { IUser } from '../models/User'
import { compactMap, getFilterings } from '../utils/helpers'

@Service()
class FollowService {
	constructor(
		@Inject('followsModel') private FollowsModel: Model<IFollow>,
		@Inject('usersModel') private UsersModel: Model<IUser>,
	) {}

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

		const follow = await this.FollowsModel.create({ follower, following })

		await this.UsersModel.updateOne(
			{ _id: follower },
			{ $inc: { followings: 1 } },
		)
		await this.UsersModel.updateOne(
			{ _id: following },
			{ $inc: { followers: 1 } },
		)

		/* await this.UsersModel.bulkWrite([
			{
				updateOne: {
					filter: { _id: new ObjectId(follower) },
					update: { $set: { $inc: { following: 1 } } },
				},
			},
			{
				updateOne: {
					filter: { _id: new ObjectId(following) },
					update: { $set: { $inc: { follower: 1 } } },
				},
			},
		]) */

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

		await this.UsersModel.updateOne(
			{ _id: follower },
			{ $inc: { followings: -1 } },
		)
		await this.UsersModel.updateOne(
			{ _id: following },
			{ $inc: { followers: -1 } },
		)

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
