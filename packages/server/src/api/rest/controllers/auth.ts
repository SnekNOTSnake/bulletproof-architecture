import { Container } from 'typedi'
import { Response } from 'express'

import myEmitter, { userSignup } from '../../../events/events'
import AuthService from '../../../services/Auth'
import catchAsync from '../../../utils/catchAsync'
import envelope from '../../../utils/envelope'
import {
	createAccessToken,
	createRefreshToken,
	sendRefreshToken,
	removeRefreshToken,
} from '../../../utils/token'
import { AUTH_KEY, NODE_ENV } from '../../../config'

const sendOAuthResponse = (res: Response, authData: string) => {
	const targetOrigin = NODE_ENV === 'production' ? 'http://localhost:4200' : '*'

	res.status(200).send(`
		<html>
			<p>Loading...</p>
			<div
				id="authData"
				style="display: none"
			>${authData}</div>
			<div
				id="targetOrigin"
				style="display: none"
			>${targetOrigin}</div>
			<script src="/js/handlePopup.js"></script>
		</html>
	`)
}

export const refreshToken = catchAsync(async (req, res, next) => {
	const refreshToken = req.cookies[AUTH_KEY]
	if (!refreshToken) return next(new Error('Empty refresh token cookie'))

	const authServiceInstance = Container.get(AuthService)
	const result = await authServiceInstance.refreshToken(refreshToken)

	sendRefreshToken(req, res, result.refreshToken)
	envelope(res, {
		accessToken: result.accessToken,
		user: result.user,
	})
})

export const signup = catchAsync(async (req, res, next) => {
	const { name, email, password } = req.body

	const authServiceInstance = Container.get(AuthService)
	const user = await authServiceInstance.signup({ name, email, password })

	myEmitter.emit(userSignup, { user })

	envelope(res, { user })
})

export const signin = catchAsync(async (req, res, next) => {
	const { email, password } = req.body

	const authServiceInstance = Container.get(AuthService)
	const result = await authServiceInstance.signin({ email, password })

	sendRefreshToken(req, res, result.refreshToken)
	envelope(res, {
		accessToken: result.accessToken,
		user: result.user,
	})
})

export const logout = catchAsync(async (req, res, next) => {
	removeRefreshToken(req, res)
	envelope(res, {})
})

export const googleCallback = catchAsync(async (req, res, next) => {
	if (!req.user)
		return res.status(400).json({
			message:
				"Something is wrong here, are you trying to access this page without asking for Google's permission?",
		})

	const refreshToken = createRefreshToken(req.user)
	const accessToken = createAccessToken(req.user)
	sendRefreshToken(req, res, refreshToken)

	const authData = JSON.stringify({
		source: 'oauth-login',
		payload: {
			accessToken,
			user: req.user,
		},
	})

	sendOAuthResponse(res, authData)
})

export const gitHubCallback = catchAsync(async (req, res, next) => {
	if (!req.user)
		return res.status(400).json({
			message:
				"Something is wrong here, are you trying to access this page without asking for GitHub's permission?",
		})

	const refreshToken = createRefreshToken(req.user)
	const accessToken = createAccessToken(req.user)
	sendRefreshToken(req, res, refreshToken)

	const authData = JSON.stringify({
		source: 'oauth-login',
		payload: {
			accessToken,
			user: req.user,
		},
	})

	sendOAuthResponse(res, authData)
})

export const me = catchAsync(async (req, res, next) => {
	envelope(res, { user: req.user })
})
