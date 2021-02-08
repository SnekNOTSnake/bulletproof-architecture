import winston from 'winston'
import { NODE_ENV } from '../config'

const transports = []

switch (NODE_ENV) {
	case 'mocha':
	case 'development':
		transports.push(
			new winston.transports.Console({
				format: winston.format.combine(
					winston.format.colorize(),
					winston.format.cli(),
					winston.format.splat(),
				),
			}),
		)
		break

	default:
		transports.push(new winston.transports.Console())
		break
}

const logger = winston.createLogger({
	level: 'silly',
	levels: winston.config.npm.levels,
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}),
		winston.format.errors({ stack: true }),
		winston.format.splat(),
		winston.format.json(),
	),
	transports,
})

export default logger
