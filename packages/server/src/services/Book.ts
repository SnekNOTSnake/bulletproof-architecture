import { Model, ObjectId } from 'mongoose'
import { Service, Inject } from 'typedi'
import xss from 'xss'

import { trim } from '../utils/helpers'
import AppError from '../utils/AppError'
import { IBook } from '../models/Books'

@Service()
class BookService {
	constructor(@Inject('booksModel') private BooksModel: Model<IBook>) {}

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

		await this.BooksModel.findByIdAndDelete(id)

		return id
	}

	async getBook(id: string) {
		const book = await this.BooksModel.findById(id)
		return book
	}

	async getBooks({
		first,
		after,
		last,
		before,
	}: {
		first?: number | null
		after?: string | null
		last?: number | null
		before?: string | null
	}) {
		if (first && last)
			throw new AppError(
				'`first` and `last` cannot be used at the same time',
				400,
			)
		if (!first && !last)
			throw new AppError('Either `first` or `last` is required', 400)
		if (after && before)
			throw new AppError(
				'`after` and `before` cannot be used at the same time',
				400,
			)

		const books = await this.BooksModel.find({
			...(after ? { created: { $lt: new Date(after) } } : null),
			...(before ? { created: { $gt: new Date(before) } } : null),
		})
			.sort({ created: first ? -1 : 1 })
			.limit(first ? first : last!)
			.exec()

		return books
	}
}

export default BookService
