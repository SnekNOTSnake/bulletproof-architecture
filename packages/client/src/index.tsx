import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider, ApolloClient } from '@apollo/client'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './components/App'
import cache from './utils/cache'
import './index.css'

const client = new ApolloClient({
	cache: cache,
	uri: 'http://localhost:4200/graphql',
	credentials: 'include',
})

ReactDOM.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<Router>
				<App />
			</Router>
		</ApolloProvider>
	</React.StrictMode>,
	document.querySelector('#root'),
)
