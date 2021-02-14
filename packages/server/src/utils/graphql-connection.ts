import { GraphQLResolveInfo } from 'graphql'
import { last } from 'lodash'

import { decodeCursor, encodeCursor } from './helpers'

// Function that takes function as arguments and returns a function, HOFunction
export function connection<Parent, Args extends ConnectionArgs, Context, Node>({
	cursorFromNode: getCursorFromNode,
	nodes: getNodes,
}: {
	cursorFromNode: (node: Node, nodeIndex: number) => string
	nodes: (
		parent: Parent,
		args: Args,
		context: Context,
		info: GraphQLResolveInfo,
	) => Promise<Node[]>
}): (
	parent: Parent,
	args: Args,
	context: Context,
	info: GraphQLResolveInfo,
) => Promise<Connection<ResolverTypeWrapper<Node>>> {
	return async (parent, args, context, info) => {
		if (args.first && args.last)
			throw new Error(
				'args.first and args.last cannot be used at the same time',
			)

		// Getting the desired documents (nodes)
		let modifiedArgs = { ...args }

		if (args.first) {
			modifiedArgs.first = args.first + 1 // Extra node for `hasNextPage`
			modifiedArgs.after = args.after && decodeCursor(args.after)
		} else if (args.last) {
			modifiedArgs.last = args.last + 1
			modifiedArgs.before = args.before && decodeCursor(args.before)
		}

		let nodes: Node[] = await getNodes(parent, modifiedArgs, context, info)

		// Creating the connection object based on documents (nodes) received
		if (args.first) {
			const hasNextPage = nodes.length > args.first
			const hasPreviousPage = !!args.after // Ingenious mind blowing!!

			// Remove the extra
			nodes = nodes.filter((_, i) => i < args.first!)

			const startCursor =
				nodes.length > 0 ? encodeCursor(getCursorFromNode(nodes[0], 0)) : null
			const endCursor =
				nodes.length > 0
					? encodeCursor(getCursorFromNode(last(nodes)!, nodes.length - 1))
					: null

			const pageInfo: PageInfo = {
				hasNextPage,
				hasPreviousPage,
				startCursor,
				endCursor,
			}

			// Create the connection object
			return {
				edges: nodes.map((node, index) => ({
					node,
					cursor: encodeCursor(getCursorFromNode(node, index)),
				})),
				nodes,
				pageInfo,
			}
		} else if (args.last) {
			const hasPreviousPage = nodes.length > args.last
			const hasNextPage = !!args.before

			nodes = nodes.filter((_, i) => i < args.last!)

			const startCursor =
				nodes.length > 0 ? encodeCursor(getCursorFromNode(nodes[0], 0)) : null
			const endCursor =
				nodes.length > 0
					? encodeCursor(getCursorFromNode(last(nodes)!, nodes.length - 1))
					: null

			const pageInfo: PageInfo = {
				hasNextPage,
				hasPreviousPage,
				startCursor,
				endCursor,
			}

			return {
				edges: nodes.map((node, index) => ({
					node,
					cursor: encodeCursor(getCursorFromNode(node, index)),
				})),
				nodes,
				pageInfo,
			}
		}

		return {
			edges: [],
			nodes: [],
			pageInfo: {
				hasNextPage: false,
				startCursor: null,
				hasPreviousPage: false,
				endCursor: null,
			},
		}
	}
}
