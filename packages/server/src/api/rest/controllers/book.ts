import { Container } from 'typedi'
import catchAsync from '../../../utils/catchAsync'
import BookService from '../../../services/Book'

export const createBook = catchAsync(async (req, res, next) => {
	const { title } = req.body

	if (!title) return next(new Error('Title is required'))
	if (!req.user)
		return next(new Error('You have to be logged in to create a book'))

	const bookServiceInstance = Container.get(BookService)
	const book = await bookServiceInstance.createBook({
		title,
		author: req.user.id,
	})

	res.status(200).json({
		message: 'success',
		book: {
			id: book.id,
			title: book.title,
			created: book.created,
			author: {
				id: req.user.id,
				name: req.user.name,
				email: req.user.email,
			},
		},
	})
})

export const updateBook = catchAsync(async (req, res, next) => {
	const { title, id } = req.body

	if (!title || !id)
		return next(new Error('Title and ID are required to update book'))
	if (!req.user)
		return next(new Error('You have to be logged in to update books'))

	const bookServiceInstance = Container.get(BookService)
	const updatedBook = await bookServiceInstance.updateBook({
		id,
		title,
		userId: req.user.id,
	})

	res.status(200).json({
		message: 'success',
		book: {
			id: updatedBook.id,
			title: updatedBook.title,
			created: updatedBook.created,
			author: {
				id: req.user.id,
				name: req.user.name,
				email: req.user.email,
			},
		},
	})
})

export const deleteBook = catchAsync(async (req, res, next) => {
	const { id } = req.body

	if (!id) return next(new Error('ID is required to delete book'))
	if (!req.user)
		return next(new Error('You have to be logged in to update books'))

	const bookServiceInstance = Container.get(BookService)
	const deletedBookId = await bookServiceInstance.deleteBook({
		id,
		userId: req.user.id,
	})

	res.status(200).json({
		message: 'success',
		deletedBookId,
	})
})

export const getBooks = catchAsync(async (req, res, next) => {
	const bookServiceInstance = Container.get(BookService)
	const books = await bookServiceInstance.getBooks()

	res.status(200).json({
		message: 'success',
		books,
	})
})

export const getBook = catchAsync(async (req, res, next) => {
	const id = req.params.id

	const bookServiceInstance = Container.get(BookService)
	const book = await bookServiceInstance.getBook(id)

	res.status(200).json({
		message: 'success',
		book,
	})
})
