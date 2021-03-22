import React from 'react'

export type State = { loading: boolean; user: IUser | null; error: any }
export type Action = {
	type:
		| 'REQUEST_USER'
		| 'USER_ERROR'
		| 'USER_SUCCESS'
		| 'REMOVE_USER'
		| 'SET_USER'
	error?: any
	payload?: IUser
}

export const userReducer: React.Reducer<State, Action> = (
	state,
	{ type, payload = null, error = null },
) => {
	switch (type) {
		// Initial user request
		case 'REQUEST_USER':
			return {
				...state,
				loading: true,
			}
		case 'USER_SUCCESS':
			return {
				...state,
				loading: false,
				user: payload,
			}
		case 'USER_ERROR':
			return {
				...state,
				loading: false,
				error,
			}

		// Additional user request
		case 'REMOVE_USER':
			return {
				...state,
				user: null,
			}
		case 'SET_USER':
			return {
				...state,
				user: payload,
			}

		default:
			throw new Error(`Unhandled action type: ${type}`)
	}
}
