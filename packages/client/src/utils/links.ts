import { createHttpLink } from '@apollo/client/link/http'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

import AuthService from '../services/Auth'
import promiseToObservable from './promiseToObservable'

export const errorLink = onError(({ graphQLErrors, operation, forward }) => {
	if (!graphQLErrors) return

	for (let error of graphQLErrors) {
		switch (error.extensions?.code) {
			// Retry requests marked with UNAUTHENTICATED response
			case 'UNAUTHENTICATED':
				const accessToken = AuthService.getCurrentUser()?.accessToken
				if (!accessToken) return

				const oldHeaders = operation.getContext().headers
				return promiseToObservable(AuthService.refreshToken()).flatMap(
					(value: any) => {
						operation.setContext({
							...oldHeaders,
							authorization: `Bearer ${value}`,
						})
						return forward(operation)
					},
				)

			default:
				break
		}
	}
})

export const httpLink = createHttpLink({
	uri: 'http://localhost:4200/graphql',
	credentials: 'include',
})

export const authLink = setContext((_, { headers }) => {
	const accessToken = AuthService.getCurrentUser()?.accessToken

	return {
		headers: {
			...headers,
			authorization: accessToken ? `Bearer ${accessToken}` : '',
		},
	}
})
