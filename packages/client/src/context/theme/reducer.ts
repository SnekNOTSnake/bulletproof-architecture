import React from 'react'

export type State = { theme: 'light' | 'dark' }
export type Action = { type: 'TOGGLE_THEME' /* payload: undefined */ }

export const themeReducer: React.Reducer<State, Action> = (state, { type }) => {
	switch (type) {
		case 'TOGGLE_THEME':
			return {
				...state,
				theme: state.theme === 'dark' ? 'light' : 'dark',
			}

		default:
			throw new Error('Unhandled action type')
	}
}
