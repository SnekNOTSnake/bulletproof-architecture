import { Container } from 'typedi'
import { Response } from 'express'

import AuthService from '../../../services/Auth'
import AppError from '../../../utils/AppError'
import catchAsync from '../../../utils/catchAsync'
import { envelope } from '../../../utils/helpers'
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

export const authData = catchAsync(async (req, res, next) => {
	const refreshToken = req.cookies[AUTH_KEY]
	if (!refreshToken)
		return next(new AppError('Empty refresh token cookie', 401))

	const authServiceInstance = Container.get(AuthService)
	const result = await authServiceInstance.getAuthData(refreshToken)

	sendRefreshToken(req, res, result.refreshToken)
	envelope(res, {
		accessToken: result.accessToken,
		user: result.user,
		newNotifs: result.newNotifs,
	})
})

export const refreshToken = catchAsync(async (req, res, next) => {
	const refreshToken = req.cookies[AUTH_KEY]
	if (!refreshToken)
		return next(new AppError('Empty refresh token cookie', 401))

	const authServiceInstance = Container.get(AuthService)
	const result = await authServiceInstance.refreshToken(refreshToken)

	sendRefreshToken(req, res, result.refreshToken)
	envelope(res, {
		accessToken: result.accessToken,
	})
})

export const signup = catchAsync(async (req, res, next) => {
	const { name, email, password } = req.body

	const authServiceInstance = Container.get(AuthService)
	const user = await authServiceInstance.signup({ name, email, password })

	envelope(res, { user })
})

export const signin = catchAsync(async (req, res, next) => {
	const { email, password } = req.body

	const authServiceInstance = Container.get(AuthService)
	const result = await authServiceInstance.signin({ email, password })

	sendRefreshToken(req, res, result.refreshToken)
	envelope(res, {
		accessToken: result.accessToken,
		newNotifs: result.newNotifs,
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

	const authServiceInstance = Container.get(AuthService)
	const { newNotifs } = await authServiceInstance.getUserStats(req.user.id)

	const refreshToken = createRefreshToken(req.user)
	const accessToken = createAccessToken(req.user)
	sendRefreshToken(req, res, refreshToken)

	const authData = JSON.stringify({
		source: 'oauth-login',
		payload: {
			accessToken,
			user: req.user,
			newNotifs,
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

	const authServiceInstance = Container.get(AuthService)
	const { newNotifs } = await authServiceInstance.getUserStats(req.user.id)

	const refreshToken = createRefreshToken(req.user)
	const accessToken = createAccessToken(req.user)
	sendRefreshToken(req, res, refreshToken)

	const authData = JSON.stringify({
		source: 'oauth-login',
		payload: {
			accessToken,
			user: req.user,
			newNotifs,
		},
	})

	sendOAuthResponse(res, authData)
})

export const changePassword = catchAsync(async (req, res, next) => {
	const { password, newPassword } = req.body
	const user = req.user

	if (!user) throw new AppError('Something went terribly wrong', 500)

	const authServiceInstance = Container.get(AuthService)
	await authServiceInstance.changePassword({
		user,
		password,
		newPassword,
	})

	logout(req, res, next)
})

export const me = catchAsync(async (req, res, next) => {
	envelope(res, { user: req.user })
})
