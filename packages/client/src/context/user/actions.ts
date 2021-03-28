import React from 'react'

import AuthService from '../../services/Auth'
import { Action } from './reducer'

export const logoutUser = async (dispatch: React.Dispatch<Action>) => {
	try {
		await AuthService.logout()

		dispatch({ type: 'REMOVE_USER' })
	} catch (error) {
		dispatch({ type: 'USER_ERROR', error })
	}
}

export const getAuthData = async (dispatch: React.Dispatch<Action>) => {
	dispatch({ type: 'REQUEST_USER' })

	try {
		const result = await AuthService.getAuthData()

		dispatch({
			type: 'USER_SUCCESS',
			payload: { user: result.user, newNotifs: result.newNotifs },
		})

		return result
	} catch (error) {
		dispatch({ type: 'USER_ERROR', error })
	}
}
