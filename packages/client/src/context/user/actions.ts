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

export const refreshToken = async (dispatch: React.Dispatch<Action>) => {
	dispatch({ type: 'REQUEST_USER' })

	try {
		const result = await AuthService.refreshToken()
		const user = result.user

		dispatch({ type: 'USER_SUCCESS', payload: user })

		return user
	} catch (error) {
		dispatch({ type: 'USER_ERROR', error })
	}
}
