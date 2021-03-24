import { Model, Types } from 'mongoose'
import { Service, Inject } from 'typedi'
import xss from 'xss'

import { trim, compactMap, getFilterings } from '../utils/helpers'
import AppError from '../utils/AppError'
import { IBook } from '../models/Book'
import { IReview } from '../models/Review'

@Service()
class ReviewService {
	constructor(
		@Inject('reviewsModel') private ReviewsModel: Model<IReview>,
		@Inject('booksModel') private BooksModel: Model<IBook>,
	) {}

	async createReview({
		book,
		author,
		content,
		rating,
	}: {
		book: string
		author: string
		content: string
		rating: number
	}) {
		const review = await this.ReviewsModel.create({
			book,
			author,
			content: xss(trim(content)),
			rating,
		})

		await this._updateBook({ book })

		return review
	}

	async _updateBook({ book }: { book: string }) {
		let stats = await this.ReviewsModel.aggregate([
			{ $match: { book: Types.ObjectId(book) } },
			{
				$group: {
					_id: '$book',
					ratingsQuantity: { $sum: 1 },
					ratingsAverage: { $avg: '$rating' },
				},
			},
		])

		// When deleting the last review, there is no result. Set the stats to 0
		if (!stats.length) {
			stats = [
				{
					ratingsAverage: 0,
					ratingsQuantity: 0,
				},
			]
		}

		await this.BooksModel.findByIdAndUpdate(book, {
			ratingsAverage: stats[0].ratingsAverage,
			ratingsQuantity: stats[0].ratingsQuantity,
		})
	}

	async updateReview({
		id,
		userId,
		content,
		rating,
	}: {
		id: string
		userId: string
		content: string
		rating: number
	}) {
		const review = await this.ReviewsModel.findById(id)

		if (!review) throw new AppError('No review with that ID', 404)
		if (String(review.author) !== userId)
			throw new AppError(
				'Unauthorized to update review, the review does not belong to you',
				403,
			)

		review.rating = rating
		review.content = xss(trim(content))
		await review.save()

		await this._updateBook({ book: String(review.book) })

		return review
	}

	async deleteReview({ id, userId }: { id: string; userId: string }) {
		const review = await this.ReviewsModel.findById(id)

		if (!review) throw new AppError('No review with that ID', 404)
		if (String(review.author) !== userId)
			throw new AppError(
				'Unauthorized to delete review, the review does not belong to you',
				403,
			)

		await this.ReviewsModel.findByIdAndDelete(id)
		await this._updateBook({ book: String(review.book) })

		return review
	}

	async getReview(id: string) {
		const review = await this.ReviewsModel.findById(id)
		return review
	}

	async getReviews({
		first,
		after,
		orderBy = 'created',
		orderType = 'DESC',
		where,
	}: {
		first: number
		after?: string | Date | null
		orderBy?: 'created' | 'rating'
		orderType?: 'ASC' | 'DESC'
		where?: {
			book?: any
			author?: any
		} | null
	}) {
		const { limit, sort, filter } = await getFilterings(this.ReviewsModel, {
			first,
			after,
			orderBy,
			orderType,
		})

		const reviews = await this.ReviewsModel.find({
			...compactMap(where || {}),
			...(filter || {}),
		})
			.sort(sort)
			.limit(limit)
			.exec()

		return reviews
	}
}

export default ReviewService
