import express from 'express'
import validate from '../middlewares/validate'
import {
	createBookSchema,
	updateBookSchema,
	deleteBookSchema,
	getBooksSchema,
} from '../../validateSchemas'
import { protect } from '../controllers/auth'
import {
	createBook,
	deleteBook,
	getBook,
	getBooks,
	updateBook,
} from '../controllers/book'

const router = express.Router()

router.get('/', validate(getBooksSchema, 'query'), getBooks)
router.get('/:id', getBook)

router
	.route('/')
	.post(protect, validate(createBookSchema), createBook)
	.patch(protect, validate(updateBookSchema), updateBook)
	.delete(protect, validate(deleteBookSchema), deleteBook)

export default router
