import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
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
import AuthService from '../../services/Auth'
import useStyles from './App.style'
import Navbar from '../../components/Navbar'

const Home = React.lazy(() => import('../Home'))
const Book = React.lazy(() => import('../Book'))
const Login = React.lazy(() => import('../Login'))
const Profile = React.lazy(() => import('../Profile'))
const CreateBook = React.lazy(() => import('../CreateBook'))
const Signup = React.lazy(() => import('../Signup'))
const Search = React.lazy(() => import('../Search'))

type LayoutProps = {
	loading: boolean
	setCurrentUser: Function
	currentUser: IUser | null
}

const Layout: React.FC<LayoutProps> = ({
	children,
	loading,
	setCurrentUser,
	currentUser,
}) => {
	const { theme } = useThemeState()

	const notistackRef = React.createRef<SnackbarProvider>()
	const onDismiss = (key: React.ReactText) => {
		if (notistackRef.current) notistackRef.current.closeSnackbar(key)
	}

	const muiTheme = React.useMemo(() => {
		return createMuiTheme({
			palette: {
				type: theme === 'light' ? 'light' : 'dark',
				background: {
					default: theme === 'light' ? '#fefefe' : '#202122',
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
			<Navbar setCurrentUser={setCurrentUser} currentUser={currentUser} />
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
	const [loading, setLoading] = React.useState<boolean>(true)
	const [currentUser, setCurrentUser] = React.useState<IUser | null>(null)

	React.useEffect(() => {
		const refreshToken = async () => {
			try {
				const data = await AuthService.refreshToken()
				setCurrentUser(data.user)
			} catch {}
			setLoading(false)
		}
		refreshToken()
	}, [])

	return (
		<ThemeProvider>
			<Layout
				loading={loading}
				setCurrentUser={setCurrentUser}
				currentUser={currentUser}
			>
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
							render={(args) => {
								if (currentUser?.id) return <Redirect to="/" />
								return <Login setCurrentUser={setCurrentUser} {...args} />
							}}
						/>
						<Route
							exact
							path="/user/:id"
							render={(params) => (
								<Profile
									{...params}
									setCurrentUser={setCurrentUser}
									user={currentUser}
								/>
							)}
						/>
						<Route
							exact
							path="/create-book"
							render={() => <CreateBook user={currentUser} />}
						/>
						<Route exact path="/signup" render={() => <Signup />} />
						<Route exact path="/search" render={() => <Search />} />
					</Switch>
				</React.Suspense>
			</Layout>
		</ThemeProvider>
	)
}

export default App
