import { Model } from 'mongoose'
import { Service, Inject } from 'typedi'
import xss from 'xss'

import { trim } from '../utils/helpers'
import AppError from '../utils/AppError'
import { IBook } from '../models/Books'
import { compactMap } from '../utils/helpers'

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
		where,
	}: {
		first: number
		after?: string | null
		where?: { _id?: string | null } | null
	}) {
		const books = await this.BooksModel.find({
			...compactMap(where || {}),
			...(after ? { created: { $lt: new Date(after) } } : null),
		})
			.sort({ created: -1 })
			.limit(first)
			.exec()

		return books
	}
}

export default BookService
