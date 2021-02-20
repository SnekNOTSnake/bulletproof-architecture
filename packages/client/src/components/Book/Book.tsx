import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Reference } from '@apollo/client'
import { useBookQuery, useDeleteBookMutation } from '../../generated/types'
import EditBook from '../EditBook'

type Props = RouteComponentProps<{ id: string }>

const Book: React.FC<Props> = ({ match, history }) => {
	const id = match.params.id

	const [isEditing, setIsEditing] = React.useState(false)
	const [mutationError, setMutationError] = React.useState<string>('')
	const { loading, data, error } = useBookQuery({ variables: { id } })

	const toggleEditing = () => setIsEditing((initVal) => !initVal)

	const [deleteBook] = useDeleteBookMutation({
		update: (cache) => {
			cache.modify({
				fields: {
					books: (existing, { readField }) => {
						const nodes: Reference[] = []
						if (existing.nodes) {
							const filtered = existing.nodes.filter(
								(nodeRef: any) => readField('id', nodeRef) !== id,
							)
							nodes.push(...filtered)
						}

						return { ...existing, nodes }
					},
				},
			})
		},
		onCompleted: () => history.push('/'),
		onError: (error) => setMutationError(error.message),
	})

	if (error) return <div>{error.message}</div>
	if (loading) return <div>Loading...</div>
	if (!data?.book) return <div>No book with that ID</div>

	return (
		<div className="Book">
			<div>
				<h2>{data.book.title}</h2>
				<ul>
					<li>Book ID: {data.book.id}</li>
					<li>Written by: {data.book.author.name}</li>
					<li>Created at: {data.book.created}</li>
					<li>Last update at: {data.book.lastChanged}</li>
				</ul>
				{mutationError ? (
					<div style={{ color: 'red' }}>{mutationError}</div>
				) : (
					''
				)}
				<button onClick={() => deleteBook({ variables: { id } })} type="button">
					Delete
				</button>
				<button onClick={toggleEditing} type="button">
					Edit
				</button>
			</div>
			{isEditing ? <EditBook id={data.book.id} title={data.book.title} /> : ''}
		</div>
	)
}

export default Book
