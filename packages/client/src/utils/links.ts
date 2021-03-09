import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { Observable } from 'apollo-link'
import { createUploadLink } from 'apollo-upload-client'

import { getAccessToken } from '../accessToken'
import { customFetch } from './fetcher'
import AuthService from '../services/Auth'

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
				const accessToken = getAccessToken()
				if (!accessToken) return

				const decoded = decodeToken(accessToken)
				if (decoded.exp >= Math.ceil(Date.now() / 1000)) return

				const oldHeaders = operation.getContext().headers
				return new Observable((observer) => {
					AuthService.refreshToken()
						.then((value) => {
							operation.setContext({
								...oldHeaders,
								authorization: `Bearer ${value}`,
							})

							const subscriber = {
								next: observer.next.bind(observer),
								error: observer.error.bind(observer),
								complete: observer.complete.bind(observer),
							}

							forward(operation).subscribe(subscriber)
						})
						.catch((err) => {
							AuthService.logout().then(() => {
								window.location.href = '/'
							})
						})
				}) as any

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
	const accessToken = getAccessToken()

	return {
		headers: {
			...headers,
			authorization: accessToken ? `Bearer ${accessToken}` : '',
		},
	}
})
