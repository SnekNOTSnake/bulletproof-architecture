import { Container } from 'typedi'
import validate from '../validate'
import {
	createBookSchema,
	updateBookSchema,
	deleteBookSchema,
} from '../../../validateSchemas'
import { MutationResolvers } from '../../generated/types'
import BookService from '../../../../services/Book'

export const createBook: MutationResolvers['createBook'] = async (
	parent,
	{ title, content, summary },
	{ user },
) => {
	await validate(createBookSchema, { title, summary, content })

	const bookServiceInstance = Container.get(BookService)
	const book = await bookServiceInstance.createBook({
		title,
		author: user.id,
		summary,
		content,
	})

	return book
}

export const updateBook: MutationResolvers['updateBook'] = async (
	parent,
	{ id, title, summary, content },
	{ user, loaders: { bookByIds } },
) => {
	await validate(updateBookSchema, { id, title, summary, content })

	const bookServiceInstance = Container.get(BookService)
	const book = await bookServiceInstance.updateBook({
		id,
		title,
		userId: user.id,
		summary,
		content,
	})
	bookByIds.clear(book.id)

	return book
}

export const deleteBook: MutationResolvers['deleteBook'] = async (
	parent,
	{ id },
	{ user },
) => {
	await validate(deleteBookSchema, { id })

	const bookServiceInstance = Container.get(BookService)
	const deletedBookID = await bookServiceInstance.deleteBook({
		id,
		userId: user.id,
	})

	return deletedBookID
}
