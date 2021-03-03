// This TS file is fucked up thanks to `jsonwebtoken`
// not providing a good type definitions

import jwt from 'jsonwebtoken'
import { Response } from 'express'
import { JWT_SECRET, JWT_EXPIRES_IN, JWT_COOKIE_EXPIRES_IN } from '../config'

type ITokenPayload = {
	id: string
	name: string
	email?: string
	joined: Date
}

export const createToken = (user: ITokenPayload) =>
	new Promise<string>((resolve, reject) => {
		const { id, name, email, joined } = user
		jwt.sign(
			{ id, name, email, joined },
			JWT_SECRET,
			{ expiresIn: JWT_EXPIRES_IN },
			(err, token: any) => {
				if (err) reject(err)
				resolve(token)
			},
		)
	})

export const decodeToken = (token: string) =>
	new Promise<ITokenPayload>((resolve, reject) => {
		jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
			if (err) return reject(err)
			if (!('exp' in decoded) || !('iat' in decoded))
				reject("Token has no 'EXP' or 'IAT'")

			resolve(decoded)
		})
	})

export const sendToken = (res: Response, token: string) => {
	const cookieOptions = {
		expires: new Date(
			Date.now() + Number(JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
		),
	}
	res.cookie('jwt', token, cookieOptions)
}
