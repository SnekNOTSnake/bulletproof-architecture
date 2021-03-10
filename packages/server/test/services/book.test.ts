import expect from 'expect'
import UserModel from '../../src/models/Users'
import AuthService from '../../src/services/Auth'
import BookModel from '../../src/models/Books'
import BookService from '../../src/services/Book'

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

const authServiceInstance = new AuthService(UserModel)
const bookServiceInstance = new BookService(BookModel)

export const testUser = {
	name: 'darn',
	email: 'darn@darn.com',
	password: 'somethingcool',
}

export const createTestBook = (authorId: string, title = 'test book') => ({
	title,
	author: authorId,
	summary: 's'.repeat(50),
	content: 'c'.repeat(100),
})

const notDefinedBookId = '602122682ec3752763f2e7fe'
const notDefinedUserId = '602144683ec3751763f2f9ff'

const newBookForm = {
	title: 'Darny darn!',
	summary: 'a'.repeat(50),
	content: 'b'.repeat(100),
}

let createdBookID = ''
let loginResult: ThenArg<
	ReturnType<typeof authServiceInstance.signin>
> = {} as any

describe('Book Service', async () => {
	before(async () => {
		await authServiceInstance.signup(testUser)
		loginResult = await authServiceInstance.signin(testUser)
	})

	describe('createBook', () => {
		it('Should return the same user with an additional ID field', async () => {
			const testBook = createTestBook(loginResult.user.id)
			const book = await bookServiceInstance.createBook(testBook)

			createdBookID = book.id

			expect(book).toBeTruthy()
			expect(book.id).toBeTruthy()
			expect(book.title).toBe(testBook.title)
			expect(book.summary).toBe(testBook.summary)
			expect(book.content).toBe(testBook.content)
			expect(String(book.author)).toBe(loginResult.user.id)

			// Create more books for other testings
			await bookServiceInstance.createBook(
				createTestBook(loginResult.user.id, 'test book 2'),
			)
			await bookServiceInstance.createBook(
				createTestBook(loginResult.user.id, 'test book 3'),
			)
		})
	})

	describe('updateBook', () => {
		it('Should be able to update book', async () => {
			const updatedBook = await bookServiceInstance.updateBook({
				...newBookForm,
				id: createdBookID,
				userId: loginResult.user.id,
			})

			expect(updatedBook).toBeTruthy()
			expect(updatedBook.id).toBe(createdBookID)
			expect(updatedBook.title).toBe(updatedBook.title)
			expect(String(updatedBook.author)).toBe(loginResult.user.id)
		})

		it('Should throw when no book is found with given ID', async () => {
			await expect(
				bookServiceInstance.updateBook({
					...newBookForm,
					id: notDefinedBookId,
					userId: loginResult.user.id,
				}),
			).rejects.toThrow()
		})

		it("Should throw when a user is updating other user's book", async () => {
			await expect(
				bookServiceInstance.updateBook({
					...newBookForm,
					id: createdBookID,
					title: 'Trolled!',
					userId: notDefinedUserId,
				}),
			).rejects.toThrow()
		})

		it('Should throw when exceeding limited length', async () => {
			await expect(
				bookServiceInstance.updateBook({
					...newBookForm,
					id: createdBookID,
					userId: loginResult.user.id,
					content: 'c'.repeat(2001),
				}),
			).rejects.toThrow()

			await expect(
				bookServiceInstance.updateBook({
					...newBookForm,
					id: createdBookID,
					userId: loginResult.user.id,
					summary: 's'.repeat(201),
				}),
			).rejects.toThrow()

			await expect(
				bookServiceInstance.updateBook({
					...newBookForm,
					id: createdBookID,
					userId: loginResult.user.id,
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
			const book = await bookServiceInstance.getBook(notDefinedBookId)

			expect(book).toBeNull()
		})
	})

	describe('getBooks', () => {
		it('Should be able to get the right numbers requested', async () => {
			const reqBooks1 = await bookServiceInstance.getBooks({ first: 2 })

			expect(reqBooks1).toBeTruthy()
			expect(reqBooks1).toHaveLength(2)

			const reqBooks2 = await bookServiceInstance.getBooks({ first: 5 })

			expect(reqBooks2).toBeTruthy()
			expect(reqBooks2).toHaveLength(3)
		})
	})

	describe('deleteBook', () => {
		it('Should be able to delete selected book', async () => {
			const deletedBookId = await bookServiceInstance.deleteBook({
				id: createdBookID,
				userId: loginResult.user.id,
			})

			expect(deletedBookId).toBe(createdBookID)
		})

		it('Should throw when no book is found with given ID', async () => {
			await expect(
				bookServiceInstance.deleteBook({
					id: notDefinedBookId,
					userId: loginResult.user.id,
				}),
			).rejects.toThrow()
		})

		it("Should throw when a user is deleting other user's book", async () => {
			await expect(
				bookServiceInstance.deleteBook({
					id: createdBookID,
					userId: notDefinedUserId,
				}),
			).rejects.toThrow()
		})
	})
})
