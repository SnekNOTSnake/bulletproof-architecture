import { Model } from 'mongoose'
import { Service, Inject } from 'typedi'
import xss from 'xss'

import { IBook } from '../models/Books'
import { compactMap } from '../utils/helpers'

@Service()
class BookService {
	constructor(@Inject('booksModel') private BooksModel: Model<IBook>) {}

	async createBook({ title, author }: { title: string; author: string }) {
		const book = await this.BooksModel.create({ title: xss(title), author })

		return book
	}

	async updateBook({
		title,
		userId,
		id,
	}: {
		id: string
		userId: string
		title: string
	}) {
		const book = await this.BooksModel.findById(id)

		if (!book) throw new Error('No book with that ID')
		if (String(book.author) !== userId)
			throw new Error(
				'Unauthorized to update book, the book does not belong to you',
			)

		book.title = xss(title)
		await book.save()

		return book
	}

	async deleteBook({ id, userId }: { id: string; userId: string }) {
		const book = await this.BooksModel.findById(id)

		if (!book) throw new Error('No book with that ID')
		if (String(book.author) !== userId)
			throw new Error(
				'Unauthorized to delete book, the book does not belong to you',
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
