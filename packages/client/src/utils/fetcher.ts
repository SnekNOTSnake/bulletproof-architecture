export const fetchData = <TData, TVariables>(
	query: string,
	variables?: TVariables,
): (() => Promise<TData>) => {
	return async () => {
		const res = await fetch('http://localhost:4200/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query,
				variables,
			}),
		})

		const json = await res.json()

		if (json.errors) {
			const { message } = json.errors[0] || 'Error..'
			throw new Error(message)
		}

		return json.data
	}
}
