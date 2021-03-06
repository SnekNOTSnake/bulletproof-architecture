import safe from 'safe-regex'
import logger from './logger'

const safeRegex = (regex: RegExp) => {
	if (!safe(regex)) {
		logger.error('Server error: Dangerous RegExp is being used')
		process.exit()
	}

	return regex
}

export default safeRegex
