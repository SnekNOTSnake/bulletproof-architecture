import express from 'express'
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

router.route('/').post(createBook).patch(updateBook).delete(deleteBook)

export default router
