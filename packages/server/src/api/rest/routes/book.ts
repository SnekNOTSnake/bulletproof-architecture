import express from 'express'
import validate from '../middlewares/validate'
import {
	createBookSchema,
	updateBookSchema,
	deleteBookSchema,
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

router.get('/', getBooks)
router.get('/:id', getBook)

// Below are routes accessible to logged in users
router.use(protect)

router
	.route('/')
	.post(validate(createBookSchema), createBook)
	.patch(validate(updateBookSchema), updateBook)
	.delete(validate(deleteBookSchema), deleteBook)

export default router
