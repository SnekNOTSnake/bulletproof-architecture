import { Container } from 'typedi'
import myEmitter, { userSignup } from '../../../events/events'
import AuthService from '../../../services/Auth'
import catchAsync from '../../../utils/catchAsync'
import { createToken, sendToken } from '../../../utils/token'

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

	sendToken(res, result.token)

	res.json({
		message: 'success',
		authData: {
			token: result.token,
			tokenExpiration: result.tokenExpiration,
		},
	})
})

export const googleCallback = catchAsync(async (req, res, next) => {
	if (!req.user)
		return res.status(400).json({
			message:
				"Something is wrong here, are you trying to access this page without asking for Google's permission?",
		})

	const token = await createToken(req.user)
	sendToken(res, token)

	res.redirect('/')
})

export const gitHubCallback = catchAsync(async (req, res, next) => {
	if (!req.user)
		return res.status(400).json({
			message:
				"Something is wrong here, are you trying to access this page without asking for GitHub's permission?",
		})

	const token = await createToken(req.user)
	sendToken(res, token)

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
