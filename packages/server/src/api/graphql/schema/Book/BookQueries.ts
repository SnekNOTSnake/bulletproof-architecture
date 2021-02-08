import { Container } from 'typedi'
import { QueryResolvers } from '../../generated/types'
import BookService from '../../../../services/Book'

export const book: QueryResolvers['book'] = async (parent, { id }) => {
	const bookServiceInstance = Container.get(BookService)
	const bookDocument = await bookServiceInstance.getBook(id)

	return bookDocument
}

export const books: QueryResolvers['books'] = async (parent) => {
	const bookServiceInstance = Container.get(BookService)
	const bookDocuments = await bookServiceInstance.getBooks()

	return bookDocuments
}
