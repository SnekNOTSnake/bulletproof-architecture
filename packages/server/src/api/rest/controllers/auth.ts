import { Container } from 'typedi'
import myEmitter, { userSignup } from '../../../events/events'
import AuthService from '../../../services/Auth'
import catchAsync from '../../../utils/catchAsync'
import {
	// createAccessToken,
	createRefreshToken,
	sendRefreshToken,
	removeRefreshToken,
} from '../../../utils/token'
import { AUTH_KEY } from '../../../config'

export const refreshToken = catchAsync(async (req, res, next) => {
	const refreshToken = req.cookies[AUTH_KEY]
	if (!refreshToken) return next(new Error('Empty refresh token cookie'))

	const authServiceInstance = Container.get(AuthService)
	const result = await authServiceInstance.refreshToken(refreshToken)

	sendRefreshToken(req, res, result.refreshToken)

	res.json({
		message: 'success',
		authData: {
			accessToken: result.accessToken,
			user: {
				id: result.user.id,
				name: result.user.name,
				email: result.user.email,
				joined: result.user.joined,
			},
		},
	})
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

	sendRefreshToken(req, res, result.refreshToken)

	res.json({
		message: 'success',
		authData: {
			accessToken: result.accessToken,
			user: {
				id: result.user.id,
				name: result.user.name,
				email: result.user.email,
				joined: result.user.joined,
			},
		},
	})
})

export const logout = catchAsync(async (req, res, next) => {
	removeRefreshToken(req, res)
	res.status(200).json({
		message: 'success',
	})
})

export const googleCallback = catchAsync(async (req, res, next) => {
	if (!req.user)
		return res.status(400).json({
			message:
				"Something is wrong here, are you trying to access this page without asking for Google's permission?",
		})

	const refreshToken = createRefreshToken(req.user)
	// const accessToken = createAccessToken(req.user)
	sendRefreshToken(req, res, refreshToken)

	res.redirect('/')
})

export const gitHubCallback = catchAsync(async (req, res, next) => {
	if (!req.user)
		return res.status(400).json({
			message:
				"Something is wrong here, are you trying to access this page without asking for GitHub's permission?",
		})

	const refreshToken = createRefreshToken(req.user)
	// const accessToken = createAccessToken(req.user)
	sendRefreshToken(req, res, refreshToken)

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
