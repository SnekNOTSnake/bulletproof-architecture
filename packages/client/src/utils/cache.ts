import { InMemoryCache, Reference } from '@apollo/client'

const cache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				books: {
					keyArgs: false,
					merge: (existing, incoming) => {
						const nodes: Reference[] = []
						if (existing && incoming.nodes) nodes.push(...existing.nodes)
						if (incoming && incoming.nodes) nodes.push(...incoming.nodes)

						return {
							...incoming,
							nodes,
						}
					},
				},
			},
		},
	},
})

export default cache
