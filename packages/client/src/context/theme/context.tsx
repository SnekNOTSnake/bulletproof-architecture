import React from 'react'
import { themeReducer, State, Action } from './reducer'

const storedSetting = localStorage.getItem('theme')
const initialState: State = storedSetting
	? JSON.parse(storedSetting)
	: { theme: 'light' }

const ThemeStateContext = React.createContext(initialState)
const ThemeDispatchContext = React.createContext<React.Dispatch<Action>>(
	() => {},
)

export const ThemeProvider: React.FC = ({ children }) => {
	const [theme, dispatch] = React.useReducer(themeReducer, initialState)

	// Persist state on each update
	React.useEffect(() => {
		localStorage.setItem('theme', JSON.stringify(theme))
	}, [theme])

	return (
		<ThemeStateContext.Provider value={theme}>
			<ThemeDispatchContext.Provider value={dispatch}>
				{children}
			</ThemeDispatchContext.Provider>
		</ThemeStateContext.Provider>
	)
}

export const useThemeState = () => React.useContext(ThemeStateContext)
export const useThemeDispatch = () => React.useContext(ThemeDispatchContext)
