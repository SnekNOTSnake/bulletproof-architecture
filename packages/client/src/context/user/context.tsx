import React from 'react'
import { userReducer, State, Action } from './reducer'

const initialState: State = {
	loading: true,
	error: [],
	data: null,
}

const UserStateContext = React.createContext(initialState)
const UserDispatchContext = React.createContext<React.Dispatch<Action>>(
	() => {},
)

export const UserProvider: React.FC = ({ children }) => {
	const [state, dispatch] = React.useReducer(userReducer, initialState)

	return (
		<UserStateContext.Provider value={state}>
			<UserDispatchContext.Provider value={dispatch}>
				{children}
			</UserDispatchContext.Provider>
		</UserStateContext.Provider>
	)
}

export const useUserState = () => React.useContext(UserStateContext)
export const useUserDispatch = () => React.useContext(UserDispatchContext)
