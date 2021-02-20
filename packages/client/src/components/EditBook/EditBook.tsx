import React from 'react'
import { useUpdateBookMutation } from '../../generated/types'

type Props = { id: string; title: string }
type InputChange = React.ChangeEvent<HTMLInputElement>
type FormSubmit = React.FormEvent<HTMLFormElement>

const EditBook: React.FC<Props> = ({ id, title }) => {
	const [inputTitle, setInputTitle] = React.useState(title)

	const [updateBook, { loading, error }] = useUpdateBookMutation({
		onError: (err) => console.error(err.message),
	})

	const onChange = (e: InputChange) => setInputTitle(e.currentTarget.value)
	const onSubmit = (e: FormSubmit) => {
		e.preventDefault()
		if (loading) return
		updateBook({ variables: { id, title: inputTitle } })
	}

	return (
		<div className="EditBook">
			<h2>EditBook</h2>
			<form onSubmit={onSubmit}>
				{error ? <div style={{ color: 'red' }}>{error.message}</div> : ''}
				<input
					type="text"
					name="title"
					value={inputTitle}
					onChange={onChange}
				/>
				<button type="submit">Save</button>
			</form>
		</div>
	)
}

export default EditBook
