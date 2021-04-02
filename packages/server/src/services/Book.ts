import { Model } from 'mongoose'
import { ObjectId } from 'mongodb'
import { Service, Inject } from 'typedi'
import xss from 'xss'

import { trim, getFilterings, compactMap } from '../utils/helpers'
import myEmitter, { NOTIF_CREATED } from '../events/events'
import AppError from '../utils/AppError'
import { IBook } from '../models/Book'
import { INotif } from '../models/Notif'
import { IFollow } from '../models/Follow'
import { IReview } from '../models/Review'

@Service()
class BookService {
	constructor(
		@Inject('booksModel') private BooksModel: Model<IBook>,
		@Inject('reviewsModel') private ReviewsModel: Model<IReview>,
		@Inject('followsModel') private FollowsModel: Model<IFollow>,
		@Inject('notifsModel') private NotifsModel: Model<INotif>,
	) {}

	async _notifyFollowers(userSender: string, book: IBook) {
		const followers = await this.FollowsModel.find({
			following: userSender as any,
		})

		const batch = followers.map((follower) =>
			this.NotifsModel.create({
				userSender,
				userTarget: follower.follower,
				type: 'NEW_BOOK',
				book: book.id,
			}),
		)

		await Promise.all(batch).then((notifs) =>
			// Send all created notifs to subscribed users
			notifs.forEach((notif) => {
				myEmitter.emit(NOTIF_CREATED, { notif })
			}),
		)

		/* await this.FollowsModel.aggregate([
			{ $match: { following: new ObjectId(userSender) } },
			{
				$project: {
					userSender: '$following',
					userTarget: '$follower',
					type: 'NEW_BOOK',
					book: new ObjectId(book.id),
					created: new Date(),
				},
			},
			{
				$addFields: {
					_id: new ObjectId(),
					read: false,
				},
			},
			{
				$merge: {
					into: {
						db: 'bulletproof-architecture',
						coll: 'notifs',
					},
					on: '_id',
					whenMatched: 'replace',
					whenNotMatched: 'insert',
				},
			},
		]) */
	}

	async createBook({
		title,
		author,
		summary,
		content,
	}: {
		title: string
		author: string
		summary: string
		content: string
	}) {
		const book = await this.BooksModel.create({
			title: xss(trim(title)),
			summary: xss(trim(summary)),
			content: xss(trim(content)),
			author,
		})

		this._notifyFollowers(book.author as any, book)

		return book
	}

	async updateBook({
		title,
		userId,
		id,
		summary,
		content,
	}: {
		id: string
		userId: string
		title: string
		summary: string
		content: string
	}) {
		const book = await this.BooksModel.findById(id)

		if (!book) throw new AppError('No book with that ID', 404)
		if (String(book.author) !== userId)
			throw new AppError(
				'Unauthorized to update book, the book does not belong to you',
				403,
			)

		book.title = xss(trim(title))
		book.summary = xss(trim(summary))
		book.content = xss(trim(content))
		await book.save()

		return book
	}

	async deleteBook({ id, userId }: { id: string; userId: string }) {
		const book = await this.BooksModel.findById(id)

		if (!book) throw new AppError('No book with that ID', 404)
		if (String(book.author) !== userId)
			throw new AppError(
				'Unauthorized to delete book, the book does not belong to you',
				403,
			)

		const removeBook = this.BooksModel.findByIdAndDelete(id)

		// Delete associated reviews and notifs
		const deleteReviews = this.ReviewsModel.deleteMany({ book: id })
		const deleteNotifs = this.NotifsModel.deleteMany({ book: id })

		await Promise.all([removeBook, deleteReviews, deleteNotifs])

		return id
	}

	async getBook(id: string) {
		const book = await this.BooksModel.findById(id)
		return book
	}

	async searchBooks({
		first,
		after,
		query,
	}: {
		first: number
		after?: string | null
		query: string
	}) {
		let score = null
		if (after) {
			const date = new Date(after)
			const result: any = await this.BooksModel.findOne(
				{
					created: date,
					$text: { $search: query },
				},
				{ score: { $meta: 'textScore' } },
			)
			score = result._doc.score
		}

		const filter = { score: { $lt: score } }
		const limit = first

		const books = await this.BooksModel.aggregate([
			{ $match: { $text: { $search: query } } },
			{ $addFields: { score: { $meta: 'textScore' }, id: '$_id' } },
			...(score ? [{ $match: filter }] : []),
			{ $sort: { score: { $meta: 'textScore' } } },
			{ $limit: limit },
		])

		return books
	}

	async getBooks({
		first,
		after,
		orderBy = 'created',
		orderType = 'DESC',
		where,
		byFollowings = null,
	}: {
		first: number
		after?: string | Date | null
		orderBy?: 'created' | 'ratingsQuantity'
		orderType?: 'ASC' | 'DESC'
		where?: {
			author?: any
		} | null
		byFollowings?: string | null
	}) {
		const { filter, limit, sort } = await getFilterings(this.BooksModel, {
			first,
			after,
			orderBy,
			orderType,
		})

		const pipeline: any[] = [
			...(filter ? [{ $match: filter }] : []),
			{ $sort: sort },
			{ $limit: limit },
			{ $addFields: { id: '$_id' } },
		]

		if (where?.author) {
			pipeline.unshift({ $match: { author: new ObjectId(where.author) } })
		}
		if (byFollowings) {
			pipeline.unshift(
				{
					$lookup: {
						from: 'follows',
						localField: 'author',
						foreignField: 'following',
						as: 'relation',
					},
				},
				{
					$match: { 'relation.follower': new ObjectId(byFollowings) },
				},
			)
		}

		const books = await this.BooksModel.aggregate(pipeline)
		return books
	}
}

export default BookService
