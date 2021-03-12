import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

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

	const classes = useStyles()

	if (loading)
		return (
			<Container fixed className={classes.container}>
				<Typography variant="h6">Loading user</Typography>
			</Container>
		)

	return (
		<Container fixed className={classes.container}>
			<Navbar setCurrentUser={setCurrentUser} currentUser={currentUser} />
			<React.Suspense
				fallback={<Typography variant="h6">Loading page</Typography>}
			>
				<Switch>
					<Route exact path="/" render={() => <Home />} />
					<Route exact path="/book/:id" render={(args) => <Book {...args} />} />
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
						path="/me"
						render={() => (
							<Profile setCurrentUser={setCurrentUser} user={currentUser} />
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
		</Container>
	)
}

export default App
