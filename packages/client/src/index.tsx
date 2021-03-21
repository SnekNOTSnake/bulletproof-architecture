import React from 'react'
import ReactDOM from 'react-dom'
import {
	ApolloProvider,
	ApolloClient,
	NormalizedCacheObject,
	from,
} from '@apollo/client'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './pages/App'
import { errorLink, authLink, uploadLink } from './utils/links'
import cache from './utils/cache'
import './assets/fonts/roboto/stylesheet.css'

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
	cache: cache,
	link: from([errorLink, authLink, uploadLink]),
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
