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

const App: React.FC = () => {
	const [currentUser, setCurrentUser] = React.useState<IUser | null>(() => {
		const data = AuthService.getCurrentUser()
		return data ? data.user : null
	})

	const classes = useStyles()

	return (
		<Container fixed className={classes.container}>
			<Navbar setCurrentUser={setCurrentUser} currentUser={currentUser} />
			<React.Suspense
				fallback={<Typography variant="h6">Loading...</Typography>}
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
						render={() => <Profile user={currentUser} />}
					/>
					<Route
						exact
						path="/create-book"
						render={() => <CreateBook user={currentUser} />}
					/>
					<Route exact path="/signup" render={() => <Signup />} />
				</Switch>
			</React.Suspense>
		</Container>
	)
}

export default App
