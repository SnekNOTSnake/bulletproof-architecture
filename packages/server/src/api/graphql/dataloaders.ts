import DataLoader from 'dataloader'

import UserModel, { IUser } from '../../models/User'
import BookModel, { IBook } from '../../models/Book'
import FollowModel, { IFollow } from '../../models/Follow'
import ReviewModel, { IReview } from '../../models/Review'

/**
 * A function to ensure Dataloader returns the same order as requested.
 * Otherwise it could return the incorrect data, which is a disaster!
 */
const ensureOrder = ({
	docs,
	keys,
	prop,
	error = (id) => `Document does not exist (${id})`,
}: {
	docs: any[]
	keys: readonly string[]
	prop: string
	error?: (id: string) => string
}) => {
	const docsMap = new Map()
	docs.forEach((doc) => docsMap.set(String(doc[prop]), doc))

	return keys.map((key) => {
		return (
			docsMap.get(key) ||
			new Error(typeof error === 'function' ? error(key) : error)
		)
	})
}

export interface ILoaders {
	userByIds: DataLoader<string, IUser>
	bookByIds: DataLoader<string, IBook>
	followByIds: DataLoader<string, IFollow>
	reviewByIds: DataLoader<string, IReview>
	batchFollows: DataLoader<FollowKey, boolean>
}

async function batchUserIds(keys: readonly string[]) {
	const users = await UserModel.find({ _id: { $in: keys } })
	return ensureOrder({ docs: users, keys, prop: '_id' })
}

async function batchBookIds(keys: readonly string[]) {
	const books = await BookModel.find({ _id: { $in: keys } })
	return ensureOrder({ docs: books, keys, prop: '_id' })
}

async function batchFollowIds(keys: readonly string[]) {
	const follows = await FollowModel.find({ _id: { $in: keys } })
	return ensureOrder({ docs: follows, keys, prop: '_id' })
}

async function batchReviewIds(keys: readonly string[]) {
	const reviews = await ReviewModel.find({ _id: { $in: keys } })
	return ensureOrder({ docs: reviews, keys, prop: '_id' })
}

type FollowKey = { follower: any; following: any }
async function batchFollows(keys: readonly FollowKey[]) {
	/* keys = [
		{ "follower": "a", "following": "b" },
		{ "follower": "a", "following": "c" }
	]
	
	found = [
		{ "follower": "a", "b" }
	]
	
	result = keys - found (not literally, but `map key in found`)
	result = [true, false] */

	const kys = keys.slice()
	const found = await FollowModel.find({ $or: kys })

	const result = kys.map((key) =>
		found.some(
			(el) =>
				String(el.follower) === String(key.follower) &&
				String(el.following) === String(key.following),
		),
	)

	return result
}

const loaders: ILoaders = {
	userByIds: new DataLoader<string, IUser>((keys) => {
		const users = batchUserIds(keys)
		return users
	}),
	bookByIds: new DataLoader<string, IBook>((keys) => batchBookIds(keys)),
	followByIds: new DataLoader<string, IFollow>((keys) => batchFollowIds(keys)),
	reviewByIds: new DataLoader<string, IReview>((keys) => batchReviewIds(keys)),
	batchFollows: new DataLoader<FollowKey, boolean>((kys) => batchFollows(kys)),
}

export default loaders
