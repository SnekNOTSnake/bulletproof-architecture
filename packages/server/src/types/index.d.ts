type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

type ReplaceReturnType<T extends (...a: any) => any, TNewReturn> = (
	...a: Parameters<T>
) => TNewReturn

// Extend Express' `req` object to contain `user` with an `id`
declare namespace Express {
	export interface Request {
		user?: {
			id: string
			name: string
			email: string
			joined: Date
		}
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
