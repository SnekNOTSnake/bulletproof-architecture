type IUser = import('../models/Users').IUser
type ReadStream = import('fs').ReadStream

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type ReplaceReturnType<T extends (...a: any) => any, TNewReturn> = (
	...a: Parameters<T>
) => TNewReturn

// Extend Express' `req` object to contain `user` with an `id`
declare namespace Express {
	export interface Request {
		user?: IUser
	}
}

type ResolverTypeWrapper<T> = Promise<T> | T

interface Connection<Node> {
	edges: Edge<Node>[]
	nodes: Node[]
	pageInfo: PageInfo
}

interface Edge<Node> {
	cursor: string
	node: Node
}

interface PageInfo {
	startCursor?: string | null
	endCursor?: string | null
	hasNextPage: boolean
	hasPreviousPage: boolean
}

type ConnectionArgs = {
	first?: number | null
	after?: string | null
	last?: number | null
	before?: string | null
}

interface GraphQLFileUpload {
	filename: string
	mimetype: string
	encoding: string
	createReadStream(options?: {
		encoding?: string
		highWaterMark?: number
	}): ReadStream
}
