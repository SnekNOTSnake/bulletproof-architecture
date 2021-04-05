import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { Typography } from '@material-ui/core'

import { ThemeProvider } from '../../context/theme'
import { UserProvider } from '../../context/user'
import Layout from '../../components/Layout'

const Home = React.lazy(() => import('../Home'))
const Book = React.lazy(() => import('../Book'))
const Login = React.lazy(() => import('../Login'))
const Profile = React.lazy(() => import('../Profile'))
const CreateBook = React.lazy(() => import('../CreateBook'))
const Signup = React.lazy(() => import('../Signup'))
const Search = React.lazy(() => import('../Search'))

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
