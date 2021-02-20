import React from 'react'
import { Link } from 'react-router-dom'
import { useBooksQuery } from '../../generated/types'
import './Home.css'

const options = { variables: { first: 2 } }
const Home: React.FC = () => {
	const { data, loading, error, fetchMore } = useBooksQuery(options)

	if (error) return <div>{error.message}</div>
	if (loading) return <div>Loading...</div>

	return (
		<div className="Home">
			<div className="container">
				{data?.books.nodes.map((book) => (
					<div key={book.id}>
						<Link to={`/book/${book.id}`}>
							<h2>{book.title}</h2>
						</Link>
						<ul>
							<li>By {book.author.name}</li>
							<li>Created at {book.created}</li>
							<li>Updated at {book.lastChanged}</li>
						</ul>
					</div>
				))}
				{data?.books.pageInfo.hasNextPage ? (
					<button
						type="button"
						onClick={() =>
							fetchMore({
								variables: { first: 2, after: data.books.pageInfo.endCursor },
							})
						}
					>
						More
					</button>
				) : (
					''
				)}
			</div>
		</div>
	)
}

export default Home
