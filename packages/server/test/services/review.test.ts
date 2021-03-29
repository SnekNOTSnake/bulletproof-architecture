import expect from 'expect'
import { Types } from 'mongoose'
import { ObjectId } from 'mongodb'

import { clearDatabase } from '../utils'
import BookModel from '../../src/models/Book'
import BookService from '../../src/services/Book'
import ReviewModel from '../../src/models/Review'
import ReviewService from '../../src/services/Review'
import NotifModel from '../../src/models/Notif'
import FollowModel from '../../src/models/Follow'

const Book = new BookService(BookModel, ReviewModel, FollowModel, NotifModel)
const Review = new ReviewService(ReviewModel, BookModel, NotifModel)

const userID = String(Types.ObjectId())
const userID2 = String(Types.ObjectId())

let bookID1 = ''
let bookID2 = ''
let reviewID1 = ''
let reviewID2 = ''

const createTestReview = async ({
	bookId = null,
	authorId = userID,
	content = 'gibberish gibberish gibberish gibberish gibberish gibberish',
	rating = 4,
}: {
	bookId?: any
	authorId?: any
	content?: any
	rating?: any
}) => {
	let book: { id: string }

	if (!bookId) {
		book = await Book.createBook({
			title: 'Book to review',
			content: 'd'.repeat(100),
			summary: 's'.repeat(50),
			author: authorId,
		})
	} else {
		book = { id: bookId }
	}

	const review = await Review.createReview({
		book: bookId ? bookId : book.id,
		author: authorId,
		content,
		rating,
	})

	return { book, review }
}

describe('ReviewService', () => {
	before(async () => {
		await clearDatabase()

		const book = await Book.createBook({
			title: 'Book to review',
			content: 'd'.repeat(100),
			summary: 's'.repeat(50),
			author: userID,
		})
		const review = await ReviewModel.create({
			book: book.id,
			author: userID,
			content: 'a'.repeat(50),
			rating: 4,
		})

		bookID2 = book.id
		reviewID2 = review.id
	})

	describe('_notifyBookAuthor', () => {
		it('Should create a notification for the book author', async () => {
			await Review._notifyBookAuthor(userID2, bookID2, reviewID2)
			const notifs = await NotifModel.find({
				type: 'REVIEW',
				review: reviewID2 as any,
			})

			expect(notifs).toHaveLength(1)
		})
	})

	describe('createReview', () => {
		it('Should be able to create a proper review', async () => {
			const content = 'Lorem ipsum dolor sit amet consectetur'
			const rating = 4

			const { review, book } = await createTestReview({
				content,
				rating,
			})

			reviewID1 = review.id
			bookID1 = book.id

			expect(review).toBeTruthy()
			expect(String(review.author)).toBe(userID)
			expect(String(review.book)).toBe(String(book.id))
			expect(review).toHaveProperty('content', content)
			expect(review).toHaveProperty('rating', rating)
		})

		it('Should not be able to create review for the same user and book', async () => {
			await expect(
				Review.createReview({
					book: bookID1,
					author: userID,
					content: 'Some random gibberish words',
					rating: 3,
				}),
			).rejects.toThrow()
		})

		it("Should modify the target book's `ratingsAverage` and `ratingsQuantity`", async () => {
			const { review } = await createTestReview({
				rating: 3,
				bookId: bookID1,
				authorId: userID2,
			})
			const book = await Book.getBook(bookID1)

			if (!book) throw new Error('book is empty')

			expect(review.rating).toBe(3)
			expect(book.ratingsAverage).toBe(3.5)
			expect(book.ratingsQuantity).toBe(2)
		})
	})

	describe('updateReview', () => {
		it('Should update the `reviewsAverage`', async () => {
			await Review.updateReview({
				id: reviewID1,
				userId: userID,
				content: 'gibberish gibberish gibberish gibberish',
				rating: 1,
			})
			const book = await Book.getBook(bookID1)

			if (!book) throw new Error('book is empty')

			expect(book.ratingsAverage).toBe(2)
		})

		it('Should be able to properly update review', async () => {
			const newContent = 'Lorem ipsum something cool'
			const newRating = 5

			const review = await Review.updateReview({
				id: reviewID1,
				userId: userID,
				content: newContent,
				rating: newRating,
			})

			expect(review).toBeTruthy()
			expect(String(review.author)).toBe(userID)
			expect(String(review.book)).toBe(bookID1)
			expect(review).toHaveProperty('content', newContent)
			expect(review).toHaveProperty('rating', newRating)
		})

		it("Should not be able to update other user's review", async () => {
			await expect(
				Review.updateReview({
					id: reviewID1,
					userId: userID2,
					content: "Something cooler than other person's content",
					rating: 1,
				}),
			).rejects.toThrow()

			const result = await Review.getReview(reviewID1)
			if (!result) throw new Error('Result is empty')

			expect(result.rating).not.toBe(1)
			expect(result.content).not.toBe(
				"Something cooler than other person's content",
			)
		})
	})

	describe('getReview', () => {
		it('Should be able to get a single review', async () => {
			const review = await Review.getReview(reviewID1)
			if (!review) throw new Error('Review is empty')

			expect(review).toBeTruthy()
			expect(String(review.book)).toBe(bookID1)
		})
	})

	describe('getReviews', () => {
		it('Should be able to get the correct number of reviews', async () => {
			const result = await Review.getReviews({ first: 2 })
			const result2 = await Review.getReviews({ first: 5 })

			expect(result[0]).toBeTruthy()
			expect(result).toHaveLength(2)
			expect(result2).toHaveLength(3)
		})

		it('Should be able to get reviews in a correct `created` order', async () => {
			const { review } = await createTestReview({ rating: 5 })

			const result = await Review.getReviews({
				first: 2,
				orderBy: 'created',
				orderType: 'ASC',
			})
			const result2 = await Review.getReviews({
				first: 2,
				orderBy: 'created',
				orderType: 'DESC',
			})

			expect(String(result[0].id)).toBe(reviewID2)
			expect(String(result2[0].id)).toBe(String(review.id))
		})

		it('Should be able to get reviews in a correct `rating` order', async () => {
			const result = await Review.getReviews({
				first: 2,
				orderBy: 'rating',
				orderType: 'ASC',
			})
			const result2 = await Review.getReviews({
				first: 2,
				orderBy: 'rating',
				orderType: 'DESC',
			})

			expect(result[0].rating).toBe(3)
			expect(result2[0].rating).toBe(5)
		})

		it('Should be able to paginate reviews with cursor', async () => {
			const result = await Review.getReviews({ first: 2 })
			const result2 = await Review.getReviews({
				first: 2,
				after: result[1].created,
			})
			const result3 = await Review.getReviews({
				first: 1,
				after: result2[1].created,
			})

			expect(result).toHaveLength(2)
			expect(result2).toHaveLength(2)
			expect(result3).toHaveLength(0)
		})

		it('Should be able to give certain search criteria', async () => {
			const result = await Review.getReviews({
				first: 2,
				where: { book: new ObjectId(bookID1) },
			})
			const result2 = await Review.getReviews({
				first: 5,
				where: { author: new ObjectId(userID) },
			})

			expect(result).toHaveLength(2)
			expect(result2).toHaveLength(3)
		})
	})

	describe('deleteReview', () => {
		it("Should not be able to delete other person's review", async () => {
			await expect(
				Review.deleteReview({ id: reviewID1, userId: userID2 }),
			).rejects.toThrow()
		})

		it('Should be able to delete a review then update `ratingsAverage` and `ratingsQuantity`', async () => {
			await Review.deleteReview({ id: reviewID1, userId: userID })
			const result = await Review.getReviews({ first: 5 })
			const book = await Book.getBook(bookID1)

			if (!book) throw new Error('Book is empty')

			expect(result).toHaveLength(3)
			expect(book.ratingsAverage).toBe(3)
			expect(book.ratingsQuantity).toBe(1)
		})

		it('Should delete the associated reviews', async () => {
			await Review.deleteReview({ id: reviewID2, userId: userID })
			const notifs = await NotifModel.find({
				review: reviewID2 as any,
				type: 'REVIEW',
			})

			expect(notifs).toHaveLength(0)
		})
	})
})
