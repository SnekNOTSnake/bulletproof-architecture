/**
 * Replace the last character of given string with string `a` or `b`,
 * giving support to hex characters.
 */
export const modifyLastCharacter = function (str: string) {
	const replacer = str.endsWith('a') ? 'b' : 'a'
	const modifiedString = str.substr(0, str.length - 1) + replacer

	return modifiedString
}
