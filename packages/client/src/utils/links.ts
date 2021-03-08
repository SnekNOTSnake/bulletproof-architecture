import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { createUploadLink } from 'apollo-upload-client'

import { customFetch } from './fetcher'
import AuthService from '../services/Auth'
import promiseToObservable from './promiseToObservable'

const decodeToken = <T = any>(token: string): T => {
	const base64url = token.split('.')[1]
	const base64 = base64url.replace(/_/g, '/').replace(/-/g, '+')
	return JSON.parse(atob(base64))
}

export const errorLink = onError(({ graphQLErrors, operation, forward }) => {
	if (!graphQLErrors) return

	for (let error of graphQLErrors) {
		switch (error.extensions?.code) {
			// Retry requests marked with UNAUTHENTICATED response
			case 'UNAUTHENTICATED':
				const accessToken = AuthService.getCurrentUser()?.accessToken
				if (!accessToken) return

				const decoded = decodeToken(accessToken)
				if (decoded.exp >= Math.ceil(Date.now() / 1000)) return

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

export const uploadLink = createUploadLink({
	uri: 'http://localhost:4200/graphql',
	credentials: 'include',
	fetch: customFetch,
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
