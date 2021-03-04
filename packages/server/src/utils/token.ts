// This TS file is fucked up thanks to `jsonwebtoken`
// not providing a good type definitions

import jwt from 'jsonwebtoken'
import { Request, CookieOptions, Response } from 'express'
import {
	AUTH_KEY,
	JWT_SECRET,
	JWT_ACCESS_TOKEN_EXPIRES,
	JWT_REFRESH_TOKEN_EXPIRES,
	JWT_COOKIE_EXPIRES,
} from '../config'

type ITokenPayload = { userId: string }

export const decodeToken = (token: string) =>
	new Promise<ITokenPayload>((resolve, reject) => {
		jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
			if (err) return reject(err)
			if (!('exp' in decoded) || !('iat' in decoded))
				reject("Token has no 'EXP' or 'IAT'")

			resolve(decoded)
		})
	})

export const createAccessToken = (user: IUser) => {
	const options = { expiresIn: JWT_ACCESS_TOKEN_EXPIRES }
	const payload: ITokenPayload = { userId: user.id }
	return jwt.sign(payload, JWT_SECRET, options)
}

export const createRefreshToken = (user: IUser) => {
	const options = { expiresIn: JWT_REFRESH_TOKEN_EXPIRES }
	const payload: ITokenPayload = { userId: user.id }
	return jwt.sign(payload, JWT_SECRET, options)
}

export const sendRefreshToken = (
	req: Request,
	res: Response,
	token: string,
) => {
	const options: CookieOptions = {
		httpOnly: true,
		path: '/api/auth/refresh-token',
		expires: new Date(
			Date.now() + Number(JWT_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000,
		),
		secure: req.secure || req.headers['x-forward-proto'] === 'https',
	}
	res.cookie(AUTH_KEY, token, options)
}

export const removeRefreshToken = (req: Request, res: Response) => {
	const options: CookieOptions = {
		httpOnly: true,
		path: '/api/auth/refresh-token',
		secure: req.secure || req.headers['x-forward-proto'] === 'https',
	}
	res.clearCookie(AUTH_KEY, options)
}
