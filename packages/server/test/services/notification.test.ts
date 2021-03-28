import expect from 'expect'
import { Types } from 'mongoose'

import NotifModel from '../../src/models/Notif'
import NotifService from '../../src/services/Notif'

const Notif = new NotifService(NotifModel)

const senderID1 = String(Types.ObjectId())
const senderID2 = String(Types.ObjectId())
const receiverID1 = String(Types.ObjectId())

let firstNotifID = ''

describe('NotifService', () => {
	before(async () => {
		// Clear previous data
		await NotifModel.deleteMany({})

		// Following event
		const result = await NotifModel.create({
			userSender: senderID1,
			userTarget: receiverID1,
			follow: String(Types.ObjectId()),
		})

		firstNotifID = result.id

		// Review event
		await NotifModel.create({
			userSender: senderID2,
			userTarget: receiverID1,
			review: String(Types.ObjectId()),
		})
	})

	describe('getNotifs', () => {
		it('Should be able to get the correct number of notifs', async () => {
			const result = await Notif.getNotifs({
				userId: receiverID1,
				first: 2,
			})
			const result2 = await Notif.getNotifs({
				userId: receiverID1,
				first: 5,
			})

			expect(result[0]).toBeTruthy()
			expect(result).toHaveLength(2)
			expect(result2).toHaveLength(2)
		})

		it('Should be able to get notifs in a correct `created` order', async () => {
			const notif = await NotifModel.create({
				userSender: senderID1,
				userTarget: receiverID1,
				follow: String(Types.ObjectId()),
			})

			const result = await Notif.getNotifs({
				userId: receiverID1,
				first: 2,
				orderBy: 'created',
				orderType: 'ASC',
			})
			const result2 = await Notif.getNotifs({
				userId: receiverID1,
				first: 2,
				orderBy: 'created',
				orderType: 'DESC',
			})

			expect(String(result[0].id)).toBe(firstNotifID)
			expect(String(result2[0].id)).toBe(String(notif.id))
		})

		it('Should be able to paginate notifs with cursor', async () => {
			const result = await Notif.getNotifs({
				userId: receiverID1,
				first: 2,
			})
			const result2 = await Notif.getNotifs({
				userId: receiverID1,
				first: 1,
				after: result[1].created,
			})
			const result3 = await Notif.getNotifs({
				userId: receiverID1,
				first: 1,
				after: result2[0].created,
			})

			expect(result).toHaveLength(2)
			expect(result2).toHaveLength(1)
			expect(result3).toHaveLength(0)
		})

		it('Should be able to give certain search criteria', async () => {
			const result = await Notif.getNotifs({
				userId: receiverID1,
				first: 2,
				where: { read: false },
			})
			const result2 = await Notif.getNotifs({
				userId: receiverID1,
				first: 5,
				where: { read: true },
			})

			expect(result).toHaveLength(2)
			expect(result2).toHaveLength(0)
		})
	})

	describe('readNotifs', () => {
		it('Should read all of the unread notifs', async () => {
			const result = await Notif.readNotifs({ userId: receiverID1 })

			expect(result).toBe(true)
		})
	})

	describe('deleteNotif', () => {
		it('Should be able to delete notif', async () => {
			const result = await Notif.deleteNotif({
				userId: senderID2,
				id: firstNotifID,
			})

			expect(result).toBe(true)
		})
	})
})
