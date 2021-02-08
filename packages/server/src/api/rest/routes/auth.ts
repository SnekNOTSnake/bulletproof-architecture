import express from 'express'
import { signup, signin, protect, me } from '../controllers/auth'

const router = express.Router()

router.post('/signup', signup)
router.post('/signin', signin)

// Below are routes accessible to logged in users
router.use(protect)

router.get('/me', me)

export default router
