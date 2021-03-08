import { Container } from 'typedi'

import { decodeCursor, encodeCursor } from '../../../utils/helpers'
import envelope from '../../../utils/envelope'
import catchAsync from '../../../utils/catchAsync'
import BookService from '../../../services/Book'

export const createBook = catchAsync(async (req, res, next) => {
	const { title } = req.body

	if (!req.user)
		return next(new Error('You have to be logged in to create a book'))

	const bookServiceInstance = Container.get(BookService)
	const book = await bookServiceInstance.createBook({
		title,
		author: req.user.id,
	})

	envelope(res, {
		book,
	})
})

export const updateBook = catchAsync(async (req, res, next) => {
	const { title, id } = req.body

	if (!req.user)
		return next(new Error('You have to be logged in to update books'))

	const bookServiceInstance = Container.get(BookService)
	const updatedBook = await bookServiceInstance.updateBook({
		id,
		title,
		userId: req.user.id,
	})

	envelope(res, { book: updatedBook })
})

export const deleteBook = catchAsync(async (req, res, next) => {
	const { id } = req.body

	if (!req.user)
		return next(new Error('You have to be logged in to update books'))

	const bookServiceInstance = Container.get(BookService)
	const deletedBookId = await bookServiceInstance.deleteBook({
		id,
		userId: req.user.id,
	})

	envelope(res, { book: { id: deletedBookId } })
})

export const getBooks = catchAsync(async (req, res, next) => {
	const { first, where, after } = req.query as any

	const bookServiceInstance = Container.get(BookService)
	const books = await bookServiceInstance.getBooks({
		first: Number(first),
		where,
		after: after && decodeCursor(after),
	})

	envelope(res, {
		edges: books.map((book) => ({
			node: book,
			cursor: encodeCursor(book.created.toISOString()),
		})),
	})
})

export const getBook = catchAsync(async (req, res, next) => {
	const id = req.params.id

	const bookServiceInstance = Container.get(BookService)
	const book = await bookServiceInstance.getBook(id)

	envelope(res, { book })
})
