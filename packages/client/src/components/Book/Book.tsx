import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useBookQuery } from '../../generated/types'

type Props = RouteComponentProps<{ id: string }>

const Book: React.FC<Props> = (props) => {
	const id = props.match.params.id
	const { loading, data, error } = useBookQuery({ variables: { id } })

	if (error) return <div>{error.message}</div>
	if (loading) return <div>Loading...</div>
	if (!data?.book) return <div>No book with that ID</div>

	return (
		<div className="Book">
			<h2>{data.book.title}</h2>
			<ul>
				<li>Book ID: {data.book.id}</li>
				<li>Written by: {data.book.author.name}</li>
				<li>Created at: {data.book.created}</li>
				<li>Last update at: {data.book.lastChanged}</li>
			</ul>
		</div>
	)
}

export default Book
