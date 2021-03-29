import expect from 'expect'
import { Types } from 'mongoose'

import { clearDatabase } from '../utils'
import AuthModel from '../../src/models/User'
import AuthService from '../../src/services/Auth'
import BookModel from '../../src/models/Book'
import BookService from '../../src/services/Book'
import ReviewModel from '../../src/models/Review'
import ReviewService from '../../src/services/Review'
import NotifModel from '../../src/models/Notif'
import FollowModel from '../../src/models/Follow'
import FollowService from '../../src/services/Follow'

const Auth = new AuthService(AuthModel, NotifModel)
const Book = new BookService(BookModel, ReviewModel, FollowModel, NotifModel)
const Review = new ReviewService(ReviewModel, BookModel, NotifModel)
const Follow = new FollowService(FollowModel, AuthModel, NotifModel)

let userID1 = '' // Primary user
let userID2 = '' // Secondary user. For deleting, updating, and such
let userID3 = '' // Secondary user.

const undefinedBookID = String(Types.ObjectId())
let bookID1 = ''

const updatedBookForm = {
	title: 'Darny darn!',
	summary: 'a'.repeat(50),
	content: 'b'.repeat(100),
}

export const createTestBook = (
	title = 'Test book',
): { title: string; author: string; summary: string; content: string } => ({
	title,
	author: userID1,
	summary: 's'.repeat(50),
	content: 'c'.repeat(100),
})

describe('Book Service', async () => {
	before(async () => {
		// Clear previous data
		await clearDatabase()

		// Signing up users
		const user1 = await Auth.signup({
			name: 'test user 1',
			email: 'test@user.com',
			password: 'somethingcool',
		})
		const user2 = await Auth.signup({
			name: 'test user 2',
			email: 'test2@user.com',
			password: 'somethingcool',
		})
		const user3 = await Auth.signup({
			name: 'test user 3',
			email: 'test3@user.com',
			password: 'somethingcool',
		})

		userID1 = String(user1.id)
		userID2 = String(user2.id)
		userID3 = String(user3.id)

		// Signing user relationships
		await Follow.followUser({ follower: user2.id, following: user1.id })
		await Follow.followUser({ follower: user3.id, following: user1.id })
	})

	describe('_notifyFollowers', () => {
		it('Should create notifications to each `following` users', async () => {
			const book = await Book.createBook(createTestBook('Darny darn!'))
			await Book._notifyFollowers(userID1, book)
			const notifs = await NotifModel.find({ type: 'NEW_BOOK' })

			expect(notifs).toHaveLength(2)
			expect(notifs.some((n) => String(n.userTarget) === userID2)).toBe(true)
			expect(notifs.some((n) => String(n.userTarget) === userID3)).toBe(true)
			expect(notifs[0].userSender).toBe(userID1)
			expect(notifs[0].type).toBe('NEW_BOOK')
			expect(String(notifs[0].book)).toBe(String(book.id))
			expect(notifs[0].review).toBeFalsy()
		})
	})

	describe('createBook', () => {
		it('Should return the same user with an additional ID field', async () => {
			const testBook = createTestBook()
			const book = await Book.createBook(testBook)

			bookID1 = book.id

			expect(book).toBeTruthy()
			expect(book.id).toBeTruthy()
			expect(book.title).toBe(testBook.title)
			expect(book.summary).toBe(testBook.summary)
			expect(book.content).toBe(testBook.content)
			expect(String(book.author)).toBe(userID1)
		})
	})

	describe('updateBook', () => {
		it('Should be able to update book', async () => {
			const updatedBook = await Book.updateBook({
				...updatedBookForm,
				id: bookID1,
				userId: userID1,
			})

			expect(updatedBook).toBeTruthy()
			expect(updatedBook.id).toBe(bookID1)
			expect(updatedBook.title).toBe(updatedBook.title)
			expect(String(updatedBook.author)).toBe(userID1)
		})

		it('Should throw when no book is found with given ID', async () => {
			await expect(
				Book.updateBook({
					...updatedBookForm,
					id: undefinedBookID,
					userId: userID1,
				}),
			).rejects.toThrow()
		})

		it("Should throw when a user is updating other user's book", async () => {
			await expect(
				Book.updateBook({
					...updatedBookForm,
					id: bookID1,
					title: 'Trolled!',
					userId: userID2,
				}),
			).rejects.toThrow()
		})

		it('Should throw when exceeding limited length', async () => {
			await expect(
				Book.updateBook({
					...updatedBookForm,
					id: bookID1,
					userId: userID1,
					content: 'c'.repeat(2001),
				}),
			).rejects.toThrow()

			await expect(
				Book.updateBook({
					...updatedBookForm,
					id: bookID1,
					userId: userID1,
					summary: 's'.repeat(201),
				}),
			).rejects.toThrow()

			await expect(
				Book.updateBook({
					...updatedBookForm,
					id: bookID1,
					userId: userID1,
					title: 't'.repeat(51),
				}),
			).rejects.toThrow()
		})
	})

	describe('getBook', () => {
		it('Should be able to get a healthy single book', async () => {
			const book: any = await Book.getBook(bookID1)

			expect(book).toBeTruthy()
			expect(book.id).toBe(bookID1)
			expect(book).toHaveProperty('title')
			expect(book).toHaveProperty('author')
			expect(book).toHaveProperty('summary')
			expect(book).toHaveProperty('content')
		})

		it('Should return null when no book is found', async () => {
			const book = await Book.getBook(undefinedBookID)

			expect(book).toBeNull()
		})
	})

	describe('getBooks', () => {
		before(async () => await Book.createBook(createTestBook('Test book 2')))

		it('Should be able to get the right numbers requested', async () => {
			const reqBooks1 = await Book.getBooks({ first: 2 })

			expect(reqBooks1).toBeTruthy()
			expect(reqBooks1).toHaveLength(2)

			const reqBooks2 = await Book.getBooks({ first: 8 })

			expect(reqBooks2).toBeTruthy()
			expect(reqBooks2).toHaveLength(3)
		})
	})

	describe('searchBooks', () => {
		let uniqueBook = ''

		before(async () => {
			const book = await Book.createBook({
				...createTestBook('Unique book to search for'),
				summary: 'This one is with a different summary',
				content:
					'gibberish content to help the engine find me padding padding padding padding padding padding padding',
			})
			const book2 = await Book.createBook({
				...createTestBook(),
				summary: 'book with a "search" keyword but less priority',
			})

			uniqueBook = book.id
		})

		it('Should be able to search for a certain books', async () => {
			const title1 = 'Test'
			const title2 = '"Unique book to search for"'

			const result1 = await Book.searchBooks({
				first: 5,
				query: title1,
			})
			const result2 = await Book.searchBooks({
				first: 5,
				query: title2,
			})

			expect(result1).toHaveLength(2)

			expect(result2).toHaveLength(1)
			expect(String(result2[0].id)).toBe(uniqueBook)
		})

		it('Should be able to search with summary and content', async () => {
			const roughSummary = 'This is different summary'
			const roughContent = 'gibberish engine'

			const result1 = await Book.searchBooks({
				first: 5,
				query: roughSummary,
			})
			const result2 = await Book.searchBooks({
				first: 5,
				query: roughContent,
			})

			expect(result1).toHaveLength(1)
			expect(String(result1[0].id)).toBe(uniqueBook)
			expect(result2).toHaveLength(1)
			expect(String(result2[0].id)).toBe(uniqueBook)
		})

		it('Should prioritize title more than summary', async () => {
			const result = await Book.searchBooks({
				first: 5,
				query: 'search',
			})

			expect(result).toHaveLength(2)
			expect(String(result[0].id)).toBe(uniqueBook)
		})

		it('Should return empty array when no book matches', async () => {
			const result = await Book.searchBooks({
				first: 5,
				query: 'i8923hr823m7',
			})

			expect(result).toHaveLength(0)
		})

		it('Should be able to paginate search results', async () => {
			const query = 'test'

			const result1 = await Book.searchBooks({
				first: 1,
				query: query,
			})

			expect(result1[0].id).toBeTruthy()

			const result2 = await Book.searchBooks({
				first: 1,
				query: query,
				after: result1[0].created,
			})

			expect(result2[0].id).toBeTruthy()

			const result3 = await Book.searchBooks({
				first: 1,
				query: query,
				after: result2[0].created,
			})

			expect(result3).toHaveLength(0)
		})
	})

	describe('deleteBook', () => {
		it('Should be able to delete selected book as well as deleting associated notifs', async () => {
			const deletedBookId = await Book.deleteBook({
				id: bookID1,
				userId: userID1,
			})

			const notifs = await NotifModel.find({ type: 'NEW_BOOK' })

			expect(deletedBookId).toBe(bookID1)
			expect(notifs).toHaveLength(0)
		})

		it('Should also delete the associated reviews', async () => {
			const book = await Book.createBook(createTestBook())

			const review = await Review.createReview({
				author: userID1,
				book: book.id,
				content: 'c'.repeat(20),
				rating: 4,
			})

			await Book.deleteBook({ id: book.id, userId: userID1 })
			const result = await Review.getReview(review.id)

			expect(result).toBeNull()
		})

		it('Should throw when no book is found with given ID', async () => {
			await expect(
				Book.deleteBook({
					id: undefinedBookID,
					userId: userID1,
				}),
			).rejects.toThrow()
		})

		it("Should throw when a user is deleting other user's book", async () => {
			await expect(
				Book.deleteBook({
					id: bookID1,
					userId: userID2,
				}),
			).rejects.toThrow()
		})
	})
})
