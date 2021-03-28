import { Service, Inject } from 'typedi'
import { Model } from 'mongoose'

import { INotif } from '../models/Notif'
import { compactMap, getFilterings } from '../utils/helpers'

@Service()
class NotifService {
	constructor(@Inject('notifsModel') private NotifModel: Model<INotif>) {}

	async readNotifs({ userId }: { userId: string }) {
		try {
			await this.NotifModel.updateMany(
				{ userTarget: userId as any, read: false },
				{ $set: { read: true } },
			)

			return true
		} catch (err) {
			return false
		}
	}

	async deleteNotif({ userId, id }: { userId: string; id: string }) {
		try {
			await this.NotifModel.findOneAndDelete({ userTarget: userId as any, id })

			return true
		} catch (err) {
			return false
		}
	}

	async getNotifs({
		userId,
		first,
		after,
		orderBy = 'created',
		orderType = 'DESC',
		where,
	}: {
		userId: string
		first: number
		after?: string | Date | null
		orderBy?: 'created'
		orderType?: 'ASC' | 'DESC'
		where?: {
			read?: any
		} | null
	}) {
		const { limit, sort, filter } = await getFilterings(this.NotifModel, {
			first,
			after,
			orderBy,
			orderType,
		})

		const follows = await this.NotifModel.find({
			userTarget: userId as any,
			...compactMap(where || {}),
			...(filter || {}),
		})
			.sort(sort)
			.limit(limit)
			.exec()

		return follows
	}
}

export default NotifService
