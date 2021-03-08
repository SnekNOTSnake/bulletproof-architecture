import {
	GraphQLDateTime as DateTime,
	GraphQLDate as Date,
	GraphQLTime as Time,
} from 'graphql-iso-date'
import { GraphQLUpload } from 'graphql-upload'

export default {
	DateTime,
	Date,
	Time,
	Upload: GraphQLUpload,
}
