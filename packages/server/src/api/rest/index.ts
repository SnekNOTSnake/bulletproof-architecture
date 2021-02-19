import express from 'express'
import infoRoute from './routes/info'
import authRoute from './routes/auth'
import bookRoute from './routes/book'
import notFound from './routes/404'

const router = express.Router()

router.use('/info', infoRoute)
router.use('/auth', authRoute)
router.use('/books', bookRoute)
router.use('/*', notFound)

export default router
