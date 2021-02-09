import { RootHookObject } from 'mocha'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import logger from '../src/utils/logger'

const mongoServer = new MongoMemoryServer()

async function connectMemoryServer() {
	mongoose.Promise = Promise
	const mongoUri = await mongoServer.getUri()

	await mongoose.connect(mongoUri, {
		useUnifiedTopology: true,
		useCreateIndex: true,
		useNewUrlParser: true,
		useFindAndModify: false,
	})

	logger.info(`MongoDB successfully connected to ${mongoUri}\n`)
}

async function closeMemoryServer() {
	await mongoose.disconnect()
	logger.info('Closed: connection to MongoDB Memory Server')

	await mongoServer.stop()
}

export const mochaHooks: RootHookObject = {
	beforeAll: connectMemoryServer,
	afterAll: closeMemoryServer,
}
