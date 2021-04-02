import { omitBy } from 'lodash'
import { Buffer } from 'buffer'
import safe from 'safe-regex'
import express from 'express'

import AppError from './AppError'
import logger from './logger'

/**
 * Creates an object with all null values removed.
 * @param obj The object to compact
 */
export function compactMap<T extends {}>(
	obj: T,
): { [key in keyof T]: NonNullable<T[key]> } {
	return omitBy(obj, (val) => val === undefined || val === null) as any
}

/**
 * Encode plain text to Base64 encoding
 */
export const encodeCursor = (plainText: string) => {
	return Buffer.from(plainText, 'utf-8').toString('base64')
}

/**
 * Decode Base64 to UTF-8 encoding
 */
export const decodeCursor = (base64: string) => {
	return Buffer.from(base64, 'base64').toString('utf-8')
}

/**
 * Trim redundant whitesplaces from plain text
 */
export const trim = (text: string) => {
	const spaceTrimmed = text.replace(
		/[ \t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]{2,}/g,
		' ',
	)
	const lineBreakTrimmed = spaceTrimmed.replace(/[\f\n\r]{3,}/g, '\n\n')

	return lineBreakTrimmed
}

/**
 * Create basic filterings based on opaque cursor.
 * Note that the `orderBy` should be a `numeric` or `Date` field.
 */
export const getFilterings = async (
	Model: any,
	{
		first,
		after,
		orderBy = 'created',
		orderType = 'DESC',
	}: {
		first: number
		after?: string | Date | null
		orderBy?: string
		orderType?: 'ASC' | 'DESC'
	},
) => {
	const sortValue = orderType === 'ASC' ? 1 : -1
	const sort =
		orderBy === 'created'
			? { created: sortValue }
			: { [orderBy]: sortValue, created: sortValue }
	const limit = first
	let filter: object | null = null

	if (orderBy === 'created' && after) {
		// Order by `created`
		filter = {
			created:
				orderType === 'DESC'
					? { $lt: new Date(after) }
					: { $gt: new Date(after) },
		}
	} else if (orderBy !== 'created' && after) {
		// Order by `somethingElse` and then `created`
		const cursor: any = await Model.findOne({
			created: new Date(after),
		})

		if (!cursor) throw new AppError('Something went wrong', 400)

		filter = {
			$or: [
				{
					[orderBy]:
						orderType === 'DESC'
							? { $lt: cursor[orderBy] }
							: { $gt: cursor[orderBy] },
				},
				{
					$and: [
						{ [orderBy]: cursor[orderBy] },
						{
							created:
								orderType === 'DESC'
									? { $lt: new Date(after) }
									: { $gt: new Date(after) },
						},
					],
				},
			],
		}
	}

	return { sort, limit, filter }
}

/**
 * Ensure the RegExp is safe, to prevent ReDoS
 */
export const safeRegex = (regex: RegExp) => {
	if (!safe(regex)) {
		logger.error('Server error: Dangerous RegExp is being used')
		process.exit()
	}

	return regex
}

/**
 * Basic REST response enveloper
 */
export const envelope = (
	res: express.Response,
	data: object,
	options?: {
		status?: number
		message?: string
	},
) => {
	const defaults = { status: 200, message: 'success' }
	const opts = { ...defaults, ...options }

	res.status(opts.status).json({
		message: opts.message,
		data,
	})
}
