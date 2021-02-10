import express from 'express'
import validate from '../middlewares/validate'
import { signupSchema, signinSchema } from '../../validateSchemas'
import { signup, signin, protect, me } from '../controllers/auth'

const router = express.Router()

router.post('/signup', validate(signupSchema), signup)
router.post('/signin', validate(signinSchema), signin)

// Below are routes accessible to logged in users
router.use(protect)

router.get('/me', me)

export default router
