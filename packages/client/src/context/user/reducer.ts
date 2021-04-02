import React from 'react'

export type State = {
	loading: boolean
	data: { user: IUser; newNotifs: number } | null
	error: any
}
export type Action = {
	type:
		| 'REQUEST_USER'
		| 'USER_ERROR'
		| 'USER_SUCCESS'
		| 'REMOVE_USER'
		| 'SET_USER'
		| 'INCREASE_NOTIFS'
	error?: any
	payload?: { user: IUser; newNotifs: number }
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
				data: payload,
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
				data: null,
			}
		case 'SET_USER':
			return {
				...state,
				data: payload,
			}

		case 'INCREASE_NOTIFS':
			if (!state.data) return state
			return {
				...state,
				data: {
					...state.data,
					newNotifs: state.data.newNotifs + 1,
				},
			}

		default:
			throw new Error(`Unhandled action type: ${type}`)
	}
}
