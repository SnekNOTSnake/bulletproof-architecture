import React from 'react'

import Alert from '@material-ui/lab/Alert'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import { useUpdateBookMutation } from '../../generated/types'
import useStyles from './EditBook.style'

type Props = {
	id: string
	book: { title: string; summary: string; content: string }
}
type InputChange = React.ChangeEvent<HTMLInputElement>
type FormSubmit = React.FormEvent<HTMLFormElement>

const EditBook: React.FC<Props> = ({ id, book }) => {
	const [title, setTitle] = React.useState(book.title)
	const [summary, setSummary] = React.useState(book.summary)
	const [content, setContent] = React.useState(book.content)
	const [error, setError] = React.useState('')

	const [updateBook, { loading }] = useUpdateBookMutation({
		onError: (err) => setError(err.message),
	})

	const onReset = () => {
		setTitle(book.title)
		setSummary(book.summary)
		setContent(book.content)
	}
	const onTitleChange = (e: InputChange) => setTitle(e.currentTarget.value)
	const onSummaryChange = (e: InputChange) => setSummary(e.currentTarget.value)
	const onContentChange = (e: InputChange) => setContent(e.currentTarget.value)
	const onSubmit = (e: FormSubmit) => {
		e.preventDefault()
		if (loading) return
		updateBook({ variables: { id, title, summary, content } })
	}

	const classes = useStyles()

	return (
		<Box className={classes.root}>
			<Card>
				<form onSubmit={onSubmit}>
					<CardHeader title="Edit book" />
					<CardContent>
						{error ? (
							<Alert
								onClose={() => setError('')}
								className={classes.alert}
								severity="error"
							>
								{error}
							</Alert>
						) : (
							''
						)}
						<TextField
							fullWidth
							label="Title"
							variant="outlined"
							value={title}
							onChange={onTitleChange}
							className={classes.input}
						/>
						<TextField
							fullWidth
							multiline
							label="Summary"
							variant="outlined"
							value={summary}
							onChange={onSummaryChange}
							className={classes.input}
						/>
						<TextField
							fullWidth
							multiline
							label="Content"
							variant="outlined"
							value={content}
							onChange={onContentChange}
							className={classes.input}
						/>
					</CardContent>
					<CardActions>
						<Button
							disabled={loading}
							variant="contained"
							color="primary"
							type="submit"
						>
							Save
						</Button>
						<Button
							disabled={loading}
							variant="contained"
							color="primary"
							type="button"
							onClick={onReset}
						>
							Reset
						</Button>
					</CardActions>
				</form>
			</Card>
		</Box>
	)
}

export default EditBook
