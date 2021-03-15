import dotenv from 'dotenv'

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const envFound = dotenv.config()
if (envFound.error) {
	// This error should crash whole process
	throw new Error('Could not find the ".env" file')
}

export const NODE_ENV = process.env.NODE_ENV
export const PORT = process.env.PORT || 4200

export const SALT_ROUND = 12

export const MONGODB_URI =
	process.env.MONGODB_URI || 'mongodb://localhost:27017'
export const DB_NAME = process.env.DB_NAME || 'bulletproof-architecture'

export const MAILGUN_SMTP_USERNAME = process.env.MAILGUN_SMTP_USERNAME || ''
export const MAILGUN_SMTP_PASSWORD = process.env.MAILGUN_SMTP_PASSWORD || ''

export const AUTH_KEY = process.env.AUTH_KEY || 'jwt'
export const JWT_SECRET = process.env.JWT_SECRET || '$0m3thingH4RdtOgu3s5'
export const JWT_COOKIE_EXPIRES = process.env.JWT_COOKIE_EXPIRES || 30
export const JWT_ACCESS_TOKEN_EXPIRES =
	process.env.JWT_ACCESS_TOKEN_EXPIRES || '15s'
export const JWT_REFRESH_TOKEN_EXPIRES =
	process.env.JWT_REFRESH_TOKEN_EXPIRES || '30d'

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ''

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || ''
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || ''
