import { Container } from 'typedi'
import { JWT_COOKIE_EXPIRES_IN, AUTH_KEY } from '../../../config'
import myEmitter, { userSignup } from '../../../events/events'
import AuthService from '../../../services/Auth'
import catchAsync from '../../../utils/catchAsync'
import { createToken } from '../../../utils/token'

export const protect = catchAsync(async (req, res, next) => {
	const token = req.cookies[AUTH_KEY] || req.headers[AUTH_KEY]
	if (!token) return next(new Error('You have to be logged in first'))

	const authServiceInstance = Container.get(AuthService)
	const user = await authServiceInstance.protect(token)

	// Assign logged in User's ID to `req.user`
	req.user = {
		id: user.id,
		name: user.name,
		email: user.email,
		joined: user.joined,
	}

	next()
})

export const signup = catchAsync(async (req, res, next) => {
	const { name, email, password } = req.body

	const authServiceInstance = Container.get(AuthService)
	const user = await authServiceInstance.signup({ name, email, password })

	myEmitter.emit(userSignup, { user })

	res.status(200).json({
		message: 'success',
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
		},
	})
})

export const signin = catchAsync(async (req, res, next) => {
	const { email, password } = req.body

	const authServiceInstance = Container.get(AuthService)
	const result = await authServiceInstance.signin({ email, password })

	res.cookie('jwt', result.token, {
		expires: new Date(
			Date.now() + Number(JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
		),
	})

	res.redirect('/')
})

export const googleCallback = catchAsync(async (req, res, next) => {
	if (!req.user)
		return res.status(400).json({
			message:
				"Something is wrong here, are you trying to access this page without asking for Google's permission?",
		})

	const token = await createToken(req.user.id)

	res.cookie('jwt', token)
	res.redirect('/')
})

export const gitHubCallback = catchAsync(async (req, res, next) => {
	if (!req.user)
		return res.status(400).json({
			message:
				"Something is wrong here, are you trying to access this page without asking for GitHub's permission?",
		})

	const token = await createToken(req.user.id)

	res.cookie('jwt', token)
	res.redirect('/')
})

export const me = catchAsync(async (req, res, next) => {
	res.status(200).json({
		message: 'success',
		user: {
			id: req.user?.id,
			name: req.user?.name,
			email: req.user?.email,
			joined: req.user?.joined,
		},
	})
})
