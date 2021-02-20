import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Cookie from 'universal-cookie'
import decode from 'jwt-decode'
import Navbar from '../Navbar'

const Home = React.lazy(() => import('../Home'))
const Book = React.lazy(() => import('../Book'))
const Login = React.lazy(() => import('../Login'))
const Profile = React.lazy(() => import('../Profile'))
const CreateBook = React.lazy(() => import('../CreateBook'))
const Signup = React.lazy(() => import('../Signup'))

const cookies = new Cookie()

const App: React.FC = () => {
	const decoded = React.useMemo(() => {
		try {
			const token = cookies.get('jwt')
			if (!token) return
			return decode<ITokenPayload>(token)
		} catch (err) {
			return
		}
	}, [])

	return (
		<React.Fragment>
			<Navbar user={decoded} />
			<React.Suspense fallback={<div>Loading...</div>}>
				<Switch>
					<Route exact path="/" render={() => <Home />} />
					<Route exact path="/book/:id" render={(args) => <Book {...args} />} />
					<Route
						exact
						path="/login"
						render={() => {
							if (decoded?.id) return <Redirect to="/" />
							return <Login />
						}}
					/>
					<Route exact path="/me" render={() => <Profile user={decoded} />} />
					<Route
						exact
						path="/create-book"
						render={() => <CreateBook user={decoded} />}
					/>
					<Route exact path="/signup" render={() => <Signup />} />
				</Switch>
			</React.Suspense>
		</React.Fragment>
	)
}

export default App
