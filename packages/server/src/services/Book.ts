import { Model } from 'mongoose'
import { Service, Inject } from 'typedi'
import { IBook, DocumentBook } from '../models/Books'

@Service()
class BookService {
	constructor(@Inject('booksModel') private BooksModel: Model<DocumentBook>) {}

	async createBook({
		title,
		author,
	}: Pick<IBook, 'title'> & { author: string }) {
		const book = await this.BooksModel.create({ title, author })

		return book
	}

	async updateBook({
		title,
		userId,
		id,
	}: Pick<IBook, 'title'> & { id: string; userId: string }) {
		const book = await this.BooksModel.findById(id)

		if (!book) throw new Error('No book with that ID')
		if (String(book.author) !== userId)
			throw new Error(
				'Unauthorized to update book, the book does not belong to you',
			)

		book.title = title
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

	async getBooks() {
		const books = await this.BooksModel.find()
		return books
	}
}

export default BookService
