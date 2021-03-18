import expect from 'expect'
import { Types } from 'mongoose'

import BookModel from '../../src/models/Book'
import BookService from '../../src/services/Book'

const bookServiceInstance = new BookService(BookModel)

const userID = String(Types.ObjectId())
const userID2 = String(Types.ObjectId())

const bookID = String(Types.ObjectId())
let createdBookID = ''
let uniqueBookID = ''

const updatedBookForm = {
	title: 'Darny darn!',
	summary: 'a'.repeat(50),
	content: 'b'.repeat(100),
}

export const createTestBook = (
	title = 'Test book',
): { title: string; author: string; summary: string; content: string } => ({
	title,
	author: userID,
	summary: 's'.repeat(50),
	content: 'c'.repeat(100),
})

describe('Book Service', async () => {
	describe('createBook', () => {
		it('Should return the same user with an additional ID field', async () => {
			const testBook = createTestBook()
			const book = await bookServiceInstance.createBook(testBook)

			createdBookID = book.id

			expect(book).toBeTruthy()
			expect(book.id).toBeTruthy()
			expect(book.title).toBe(testBook.title)
			expect(book.summary).toBe(testBook.summary)
			expect(book.content).toBe(testBook.content)
			expect(String(book.author)).toBe(userID)

			// Create more books for other testings
			await bookServiceInstance.createBook(createTestBook('Darny darn!'))
			await bookServiceInstance.createBook(createTestBook('Test book 2'))
			const uniqueBook1 = await bookServiceInstance.createBook({
				...createTestBook('Unique book to search for'),
				summary: 'This one is with a different summary',
				content:
					'gibberish content to help the engine find me padding padding padding padding padding padding padding',
			})
			await bookServiceInstance.createBook({
				...createTestBook(),
				summary: 'book with a "search" keyword but less priority',
			})

			uniqueBookID = uniqueBook1.id
		})
	})

	describe('updateBook', () => {
		it('Should be able to update book', async () => {
			const updatedBook = await bookServiceInstance.updateBook({
				...updatedBookForm,
				id: createdBookID,
				userId: userID,
			})

			expect(updatedBook).toBeTruthy()
			expect(updatedBook.id).toBe(createdBookID)
			expect(updatedBook.title).toBe(updatedBook.title)
			expect(String(updatedBook.author)).toBe(userID)
		})

		it('Should throw when no book is found with given ID', async () => {
			await expect(
				bookServiceInstance.updateBook({
					...updatedBookForm,
					id: bookID,
					userId: userID,
				}),
			).rejects.toThrow()
		})

		it("Should throw when a user is updating other user's book", async () => {
			await expect(
				bookServiceInstance.updateBook({
					...updatedBookForm,
					id: createdBookID,
					title: 'Trolled!',
					userId: userID2,
				}),
			).rejects.toThrow()
		})

		it('Should throw when exceeding limited length', async () => {
			await expect(
				bookServiceInstance.updateBook({
					...updatedBookForm,
					id: createdBookID,
					userId: userID,
					content: 'c'.repeat(2001),
				}),
			).rejects.toThrow()

			await expect(
				bookServiceInstance.updateBook({
					...updatedBookForm,
					id: createdBookID,
					userId: userID,
					summary: 's'.repeat(201),
				}),
			).rejects.toThrow()

			await expect(
				bookServiceInstance.updateBook({
					...updatedBookForm,
					id: createdBookID,
					userId: userID,
					title: 't'.repeat(51),
				}),
			).rejects.toThrow()
		})
	})

	describe('getBook', () => {
		it('Should be able to get a healthy single book', async () => {
			const book: any = await bookServiceInstance.getBook(createdBookID)

			expect(book).toBeTruthy()
			expect(book.id).toBe(createdBookID)
			expect(book).toHaveProperty('title')
			expect(book).toHaveProperty('author')
			expect(book).toHaveProperty('summary')
			expect(book).toHaveProperty('content')
		})

		it('Should return null when no book is found', async () => {
			const book = await bookServiceInstance.getBook(bookID)

			expect(book).toBeNull()
		})
	})

	describe('getBooks', () => {
		it('Should be able to get the right numbers requested', async () => {
			const reqBooks1 = await bookServiceInstance.getBooks({ first: 2 })

			expect(reqBooks1).toBeTruthy()
			expect(reqBooks1).toHaveLength(2)

			const reqBooks2 = await bookServiceInstance.getBooks({ first: 8 })

			expect(reqBooks2).toBeTruthy()
			expect(reqBooks2).toHaveLength(5)
		})

		it('Should be able to search for a certain books', async () => {
			const title1 = 'Test'
			const title2 = '"Unique book to search for"'

			const result1 = await bookServiceInstance.getBooks({
				first: 5,
				search: title1,
			})
			const result2 = await bookServiceInstance.getBooks({
				first: 5,
				search: title2,
			})

			expect(result1).toHaveLength(2)

			expect(result2).toHaveLength(1)
			expect(String(result2[0].id)).toBe(uniqueBookID)
		})

		it('Should be able to search with summary and content', async () => {
			const roughSummary = 'This is different summary'
			const roughContent = 'gibberish engine'

			const result1 = await bookServiceInstance.getBooks({
				first: 5,
				search: roughSummary,
			})
			const result2 = await bookServiceInstance.getBooks({
				first: 5,
				search: roughContent,
			})

			expect(result1).toHaveLength(1)
			expect(String(result1[0].id)).toBe(uniqueBookID)
			expect(result2).toHaveLength(1)
			expect(String(result2[0].id)).toBe(uniqueBookID)
		})

		it('Should prioritize title more than summary', async () => {
			const result = await bookServiceInstance.getBooks({
				first: 5,
				search: 'search',
			})

			expect(result).toHaveLength(2)
			expect(String(result[0].id)).toBe(uniqueBookID)
		})

		it('Should return empty array when no book matches', async () => {
			const result = await bookServiceInstance.getBooks({
				first: 5,
				search: 'i8923hr823m7',
			})

			expect(result).toHaveLength(0)
		})

		it('Should be able to paginate search results', async () => {
			const query = 'test'

			const result1 = await bookServiceInstance.getBooks({
				first: 1,
				search: query,
			})

			expect(result1[0].id).toBeTruthy()

			const result2 = await bookServiceInstance.getBooks({
				first: 1,
				search: query,
				after: result1[0].created,
			})

			expect(result2[0].id).toBeTruthy()

			const result3 = await bookServiceInstance.getBooks({
				first: 1,
				search: query,
				after: result2[0].created,
			})

			expect(result3).toHaveLength(0)
		})
	})

	describe('deleteBook', () => {
		it('Should be able to delete selected book', async () => {
			const deletedBookId = await bookServiceInstance.deleteBook({
				id: createdBookID,
				userId: userID,
			})

			expect(deletedBookId).toBe(createdBookID)
		})

		it('Should throw when no book is found with given ID', async () => {
			await expect(
				bookServiceInstance.deleteBook({
					id: bookID,
					userId: userID,
				}),
			).rejects.toThrow()
		})

		it("Should throw when a user is deleting other user's book", async () => {
			await expect(
				bookServiceInstance.deleteBook({
					id: createdBookID,
					userId: userID2,
				}),
			).rejects.toThrow()
		})
	})
})
