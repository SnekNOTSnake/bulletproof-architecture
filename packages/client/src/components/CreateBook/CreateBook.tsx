import React from 'react'
import { gql, Reference } from '@apollo/client'
import { useCreateBookMutation } from '../../generated/types'

type Props = { user?: ITokenPayload }
type InputChange = React.ChangeEvent<HTMLInputElement>
type SubmitEvent = React.FormEvent<HTMLFormElement>

const CreateBook: React.FC<Props> = ({ user }) => {
	const [title, setTitle] = React.useState<string>('')

	const [createBook, { loading, data, error }] = useCreateBookMutation({
		update: (cache, { data }) => {
			cache.modify({
				fields: {
					books: (existing) => {
						const nodes: Reference[] = []
						if (existing.nodes) nodes.push(...existing.nodes)

						const newBookRef = cache.writeFragment({
							data: data?.createBook,
							fragment: gql`
								fragment NewBook on Book {
									id
									title
									created
									lastChanged
									author {
										name
									}
								}
							`,
						})

						nodes.unshift(newBookRef!)

						return { ...existing, nodes }
					},
				},
			})
		},
	})

	const onChange = (e: InputChange) => setTitle(e.currentTarget.value)
	const onSubmit = async (e: SubmitEvent) => {
		try {
			e.preventDefault()
			if (loading) return
			await createBook({ variables: { title } })
		} catch (err) {
			console.error(err)
		}
	}

	if (!user) return <div>You have to be logged in first</div>

	return (
		<div className="CreateBook">
			<h2>CreateBook</h2>
			<form onSubmit={onSubmit}>
				{error ? <div style={{ color: 'red' }}>{error.message}</div> : ''}
				{data?.createBook ? (
					<div>
						Created {data.createBook.id} at {data.createBook.created}
					</div>
				) : (
					''
				)}
				<input type="text" name="title" value={title} onChange={onChange} />
				<button disabled={loading} type="submit">
					Submit
				</button>
			</form>
		</div>
	)
}

export default CreateBook
