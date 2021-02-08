import express from 'express'
import infoRoute from './routes/info'
import authRoute from './routes/auth'
import bookRoute from './routes/book'

const router = express.Router()

router.use('/info', infoRoute)
router.use('/auth', authRoute)
router.use('/books', bookRoute)

export default router
