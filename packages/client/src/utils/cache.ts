import { InMemoryCache, Reference } from '@apollo/client'

const cache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				books: {
					keyArgs: ['where'],
					merge: (existing, incoming) => {
						const nodes: Reference[] = []
						if (existing && existing.nodes) nodes.push(...existing.nodes)
						if (incoming && incoming.nodes) nodes.push(...incoming.nodes)

						return {
							...incoming,
							nodes,
						}
					},
				},

				reviews: {
					keyArgs: ['where'],
					merge: (existing, incoming) => {
						const nodes: Reference[] = []
						if (existing && existing.nodes) nodes.push(...existing.nodes)
						if (incoming && incoming.nodes) nodes.push(...incoming.nodes)

						return {
							...incoming,
							nodes,
						}
					},
				},

				notifs: {
					keyArgs: false,
					merge: (existing, incoming) => {
						const nodes: Reference[] = []
						if (existing && existing.nodes) nodes.push(...existing.nodes)
						if (incoming && incoming.nodes) nodes.push(...incoming.nodes)

						return {
							...incoming,
							nodes,
						}
					},
				},

				getFollows: {
					keyArgs: ['where'],
					merge: (existing, incoming) => {
						const nodes: Reference[] = []
						if (existing && existing.nodes) nodes.push(...existing.nodes)
						if (incoming && incoming.nodes) nodes.push(...incoming.nodes)

						return {
							...incoming,
							nodes,
						}
					},
				},

				users: {
					keyArgs: false,
					merge: (existing, incoming) => {
						const nodes: Reference[] = []
						if (existing && existing.nodes) nodes.push(...existing.nodes)
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
