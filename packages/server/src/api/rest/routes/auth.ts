import express from 'express'
import passport from 'passport'
import validate from '../middlewares/validate'
import { signupSchema, signinSchema } from '../../validateSchemas'
import {
	signup,
	signin,
	protect,
	googleCallback,
	gitHubCallback,
	me,
} from '../controllers/auth'

const router = express.Router()

router.post('/signup', validate(signupSchema), signup)
router.post('/signin', validate(signinSchema), signin)

// Google
router.get(
	'/google',
	passport.authenticate('google', {
		session: false,
		scope: ['profile', 'email'],
	}),
)
router.get(
	'/google/callback',
	passport.authenticate('google', {
		session: false,
		failureRedirect: '/login',
	}),
	googleCallback,
)

// GitHub
router.get(
	'/github',
	passport.authenticate('github', {
		session: false,
		scope: ['profile', 'email'],
	}),
)
router.get(
	'/github/callback',
	passport.authenticate('github', {
		session: false,
		failureRedirect: '/login',
	}),
	gitHubCallback,
)

router.get('/me', protect, me)

export default router
