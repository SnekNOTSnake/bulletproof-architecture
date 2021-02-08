// This TS file is fucked up thanks to `jsonwebtoken`
// not providing a good type definitions

import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config'

type tokenPayload = { userId: string }

export const createToken = (userId: string) =>
	new Promise<string>((resolve, reject) => {
		jwt.sign(
			{ userId },
			JWT_SECRET,
			{ expiresIn: JWT_EXPIRES_IN },
			(err, token: any) => {
				if (err) reject(err)
				resolve(token)
			},
		)
	})

export const decodeToken = (token: string) =>
	new Promise<tokenPayload>((resolve, reject) => {
		jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
			if (err) return reject(err)
			if (!('exp' in decoded) || !('iat' in decoded))
				reject("Token has no 'EXP' or 'IAT'")

			resolve(decoded)
		})
	})
