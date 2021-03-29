import AuthModel from '../src/models/User'
import BookModel from '../src/models/Book'
import ReviewModel from '../src/models/Review'
import NotifModel from '../src/models/Notif'
import FollowModel from '../src/models/Follow'

/**
 * Replace the last character of given string with string `a` or `b`,
 * giving support to hex characters.
 */
export const modifyLastCharacter = function (str: string) {
	const replacer = str.endsWith('a') ? 'b' : 'a'
	const modifiedString = str.substr(0, str.length - 1) + replacer

	return modifiedString
}

export const clearDatabase = async function () {
	await Promise.all([
		AuthModel.deleteMany({}),
		BookModel.deleteMany({}),
		FollowModel.deleteMany({}),
		NotifModel.deleteMany({}),
		ReviewModel.deleteMany({}),
	])
}
