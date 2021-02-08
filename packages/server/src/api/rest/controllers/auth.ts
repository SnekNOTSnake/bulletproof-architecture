import { Container } from 'typedi'
import AuthService from '../../../services/Auth'
import catchAsync from '../../../utils/catchAsync'

export const protect = catchAsync(async (req, res, next) => {
	const token = req.headers.jwt as string
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

	if (!name || !email || !password)
		return next(new Error('name, email, and password are required'))

	const authServiceInstance = Container.get(AuthService)
	const user = await authServiceInstance.signup({ name, email, password })

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

	if (!email || !password)
		return next(new Error('Email or password is missing'))

	const authServiceInstance = Container.get(AuthService)
	const result = await authServiceInstance.signin({ email, password })

	res.status(200).json({
		message: 'success',
		token: result.token,
		user: {
			id: result.user.id,
			name: result.user.name,
			email: result.user.email,
		},
		tokenExpiration: result.tokenExpiration,
	})
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
