import { Container } from 'typedi'
import { QueryResolvers } from '../../generated/types'
import BookService from '../../../../services/Book'
import { connection } from '../../../../utils/graphql-connection'
import validate from '../validate'
import { getBooksSchema } from '../../../validateSchemas'

export const book: QueryResolvers['book'] = async (parent, { id }) => {
	const bookServiceInstance = Container.get(BookService)
	const bookDocument = await bookServiceInstance.getBook(id)

	return bookDocument
}

export const books: QueryResolvers['books'] = connection({
	cursorFromNode: (node) => node.created.toISOString(),
	nodes: async (parent, { first, after, last, before }, context, info) => {
		await validate(getBooksSchema, { first, after, last, before })

		const bookServiceInstance = Container.get(BookService)
		const bookDocuments = await bookServiceInstance.getBooks({
			first,
			after,
			last,
			before,
		})

		return bookDocuments
	},
})
