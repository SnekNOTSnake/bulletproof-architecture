import express from 'express'
import passport from 'passport'
import validate from '../middlewares/validate'
import protect from '../middlewares/protect'
import {
	signupSchema,
	signinSchema,
	changePasswordSchema,
} from '../../validateSchemas'
import {
	refreshToken,
	signup,
	signin,
	logout,
	googleCallback,
	gitHubCallback,
	me,
	changePassword,
} from '../controllers/auth'

const router = express.Router()

router.post('/refresh-token', refreshToken)
router.post('/signup', validate(signupSchema), signup)
router.post('/signin', validate(signinSchema), signin)
router.post('/logout', logout)
router.post(
	'/change-password',
	protect,
	validate(changePasswordSchema),
	changePassword,
)

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
