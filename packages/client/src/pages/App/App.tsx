import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'

import {
	ThemeProvider as MuiThemeProvider,
	createMuiTheme,
} from '@material-ui/core/styles'
import {
	CssBaseline,
	Box,
	IconButton,
	Container,
	Typography,
} from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'

import { ThemeProvider, useThemeState } from '../../context/theme'
import {
	useUserState,
	useUserDispatch,
	getAuthData,
	UserProvider,
} from '../../context/user'
import useStyles from './App.style'
import Navbar from '../../components/Navbar'

const Home = React.lazy(() => import('../Home'))
const Book = React.lazy(() => import('../Book'))
const Login = React.lazy(() => import('../Login'))
const Profile = React.lazy(() => import('../Profile'))
const CreateBook = React.lazy(() => import('../CreateBook'))
const Signup = React.lazy(() => import('../Signup'))
const Search = React.lazy(() => import('../Search'))

const Layout: React.FC = ({ children }) => {
	const { theme } = useThemeState()
	const userDispatch = useUserDispatch()
	const { loading, data } = useUserState()

	React.useEffect(() => {
		getAuthData(userDispatch)
	}, [])

	const notistackRef = React.createRef<SnackbarProvider>()
	const onDismiss = (key: React.ReactText) => {
		if (notistackRef.current) notistackRef.current.closeSnackbar(key)
	}

	const muiTheme = React.useMemo(() => {
		return createMuiTheme({
			palette: {
				type: theme === 'light' ? 'light' : 'dark',
				background: {
					default: theme === 'light' ? '#eee' : '#202122',
					paper: theme === 'light' ? '#fff' : '#2c2f33',
				},
				primary: {
					main: theme === 'light' ? '#1976d2' : '#42a5f5',
					contrastText: '#fff',
				},
			},
		})
	}, [theme])

	const classes = useStyles()

	const renderContent = loading ? (
		<Typography variant="h6">Loading user</Typography>
	) : (
		<Box>
			<Navbar />
			{children}
		</Box>
	)

	return (
		<MuiThemeProvider theme={muiTheme}>
			<SnackbarProvider
				ref={notistackRef}
				action={(key) => (
					<IconButton
						type="button"
						color="inherit"
						size="small"
						onClick={() => onDismiss(key)}
					>
						<CloseIcon />
					</IconButton>
				)}
				maxSnack={3}
			>
				<CssBaseline />
				<Container fixed className={classes.container}>
					{renderContent}
				</Container>
			</SnackbarProvider>
		</MuiThemeProvider>
	)
}

const App: React.FC = () => {
	return (
		<ThemeProvider>
			<UserProvider>
				<Layout>
					<React.Suspense
						fallback={<Typography variant="h6">Loading page</Typography>}
					>
						<Switch>
							<Route exact path="/" render={() => <Home />} />
							<Route
								exact
								path="/book/:id"
								render={(args) => <Book {...args} />}
							/>
							<Route
								exact
								path="/login"
								render={(args) => <Login {...args} />}
							/>
							<Route
								exact
								path="/user/:id"
								render={(params) => <Profile {...params} />}
							/>
							<Route exact path="/create-book" render={() => <CreateBook />} />
							<Route exact path="/signup" render={() => <Signup />} />
							<Route exact path="/search" render={() => <Search />} />
						</Switch>
					</React.Suspense>
				</Layout>
			</UserProvider>
		</ThemeProvider>
	)
}

export default App
