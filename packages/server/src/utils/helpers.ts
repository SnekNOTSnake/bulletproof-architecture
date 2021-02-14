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
