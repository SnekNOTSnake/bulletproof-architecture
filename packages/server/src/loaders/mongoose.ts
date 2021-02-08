import mongoose from 'mongoose'
import logger from '../utils/logger'
import { MONGODB_URI, DB_NAME } from '../config'

const loadMongoose = async () => {
	const connection = await mongoose.connect(MONGODB_URI, {
		dbName: DB_NAME,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useFindAndModify: false,
	})

	logger.info(`Connected to MongoDB ${MONGODB_URI} through mongoose `)

	return connection
}

export default loadMongoose
