import { Container } from 'typedi'

import { QueryResolvers } from '../../generated/types'
import BookService from '../../../../services/Book'
import { connection } from '../../../../utils/graphql-connection'
import validate from '../validate'
import { getBooksSchema, searchBooksSchema } from '../../../validateSchemas'

export const book: QueryResolvers['book'] = async (parent, { id }) => {
	const bookServiceInstance = Container.get(BookService)
	const bookDocument = await bookServiceInstance.getBook(id)

	return bookDocument
}

export const books: QueryResolvers['books'] = connection({
	cursorFromNode: (node) => node.created.toISOString(),
	nodes: async (
		parent,
		{ first, after, orderBy, where, byFollowings },
		{ getterId },
	) => {
		await validate(getBooksSchema, {
			first,
			after,
			orderBy,
			where,
			byFollowings,
		})

		const [orderField, orderType]: any = orderBy.split('_')

		const bookServiceInstance = Container.get(BookService)
		const bookDocuments = await bookServiceInstance.getBooks({
			first,
			after,
			orderBy: orderField,
			orderType,
			where,
			byFollowings: byFollowings && getterId ? getterId : null,
		})

		return bookDocuments
	},
})

export const searchBooks: QueryResolvers['searchBooks'] = connection({
	cursorFromNode: (node) => node.created.toISOString(),
	nodes: async (parent, { first, after, query }) => {
		await validate(searchBooksSchema, { first, after, query })

		const bookServiceInstance = Container.get(BookService)
		const result = await bookServiceInstance.searchBooks({
			first,
			after,
			query,
		})

		return result
	},
})
