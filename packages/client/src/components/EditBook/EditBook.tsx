import React from 'react'
import { useSnackbar } from 'notistack'

import {
	Box,
	Button,
	Card,
	CardHeader,
	CardContent,
	CardActions,
	TextField,
} from '@material-ui/core'

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

	const { enqueueSnackbar } = useSnackbar()

	const [updateBook, { loading }] = useUpdateBookMutation({
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
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
			<Card variant="outlined">
				<form onSubmit={onSubmit}>
					<CardHeader title="Edit book" />
					<CardContent>
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
						/>
					</CardContent>
					<CardActions>
						<Button
							variant="contained"
							disableElevation
							disabled={loading}
							color="primary"
							type="submit"
						>
							Save
						</Button>
						<Button
							variant="contained"
							disableElevation
							disabled={loading}
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
