import { omitBy } from 'lodash'
import { Buffer } from 'buffer'

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
