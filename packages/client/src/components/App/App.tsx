import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Cookie from 'universal-cookie'
import decode from 'jwt-decode'
import Navbar from '../Navbar'

const Home = React.lazy(() => import('../Home'))
const Book = React.lazy(() => import('../Book'))
const Login = React.lazy(() => import('../Login'))

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
				</Switch>
			</React.Suspense>
		</React.Fragment>
	)
}

export default App
