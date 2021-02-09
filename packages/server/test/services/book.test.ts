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

export const createTestBook = (authorId: string) => ({
	title: 'test book',
	author: authorId,
})

const notDefinedBookId = '602122682ec3752763f2e7fe'
const notDefinedUserId = '602144683ec3751763f2f9ff'

const newBookTitle = 'Darny darn!'
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
			expect(String(book.author)).toBe(loginResult.user.id)
		})
	})

	describe('updateBook', () => {
		it('Should be able to update book', async () => {
			const updatedBook = await bookServiceInstance.updateBook({
				id: createdBookID,
				title: newBookTitle,
				userId: loginResult.user.id,
			})

			expect(updatedBook).toBeTruthy()
			expect(updatedBook.id).toBe(createdBookID)
			expect(updatedBook.title).toBe(newBookTitle)
			expect(String(updatedBook.author)).toBe(loginResult.user.id)
		})

		it('Should throw when no book is found with given ID', async () => {
			await expect(
				bookServiceInstance.updateBook({
					id: notDefinedBookId,
					title: newBookTitle,
					userId: loginResult.user.id,
				}),
			).rejects.toThrow()
		})

		it("Should throw when a user is updating other user's book", async () => {
			await expect(
				bookServiceInstance.updateBook({
					id: createdBookID,
					title: 'Trolled!',
					userId: notDefinedUserId,
				}),
			).rejects.toThrow()
		})
	})

	describe('getBook', () => {
		it('Should be able to get a single book', async () => {
			const book: any = await bookServiceInstance.getBook(createdBookID)

			expect(book).toBeTruthy()
			expect(book.id).toBe(createdBookID)
		})

		it('Should return null when no book is found', async () => {
			const book = await bookServiceInstance.getBook(notDefinedBookId)

			expect(book).toBeNull()
		})
	})

	describe('getBooks', () => {
		it('Should be able to get multiple books', async () => {
			const books = await bookServiceInstance.getBooks()

			expect(books).toBeTruthy()
			expect(books.length).toBe(1)
			expect(books[0].id).toBe(createdBookID)
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
