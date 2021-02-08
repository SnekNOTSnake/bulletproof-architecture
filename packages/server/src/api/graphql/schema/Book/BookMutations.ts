import { Container } from 'typedi'
import { MutationResolvers } from '../../generated/types'
import BookService from '../../../../services/Book'

export const createBook: MutationResolvers['createBook'] = async (
	parent,
	{ title },
	{ user },
) => {
	const bookServiceInstance = Container.get(BookService)
	const book = await bookServiceInstance.createBook({ title, author: user.id })

	return book
}

export const updateBook: MutationResolvers['updateBook'] = async (
	parent,
	{ id, title },
	{ user },
) => {
	const bookServiceInstance = Container.get(BookService)
	const book = await bookServiceInstance.updateBook({
		id,
		title,
		userId: user.id,
	})

	return book
}

export const deleteBook: MutationResolvers['deleteBook'] = async (
	parent,
	{ id },
	{ user },
) => {
	const bookServiceInstance = Container.get(BookService)
	const deletedBookID = await bookServiceInstance.deleteBook({
		id,
		userId: user.id,
	})

	return deletedBookID
}
