import { omitBy } from 'lodash'
import { Buffer } from 'buffer'

import AppError from './AppError'

/**
 * Creates an object with all null values removed.
 * @param obj The object to compact
 */
export function compactMap<T extends {}>(
	obj: T,
): { [key in keyof T]: NonNullable<T[key]> } {
	return omitBy(obj, (val) => val === undefined || val === null) as any
}

export const encodeCursor = (plainText: string) => {
	return Buffer.from(plainText, 'utf-8').toString('base64')
}

export const decodeCursor = (base64: string) => {
	return Buffer.from(base64, 'base64').toString('utf-8')
}

export const trim = (text: string) => {
	const spaceTrimmed = text.replace(
		/[ \t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]{2,}/g,
		' ',
	)
	const lineBreakTrimmed = spaceTrimmed.replace(/[\f\n\r]{3,}/g, '\n\n')

	return lineBreakTrimmed
}

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
