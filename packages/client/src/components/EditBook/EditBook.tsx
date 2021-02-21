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

type Props = { id: string; title: string }
type InputChange = React.ChangeEvent<HTMLInputElement>
type FormSubmit = React.FormEvent<HTMLFormElement>

const EditBook: React.FC<Props> = ({ id, title }) => {
	const [inputTitle, setInputTitle] = React.useState(title)
	const [error, setError] = React.useState('')

	const [updateBook, { loading }] = useUpdateBookMutation({
		onError: (err) => setError(err.message),
	})

	const onChange = (e: InputChange) => setInputTitle(e.currentTarget.value)
	const onSubmit = (e: FormSubmit) => {
		e.preventDefault()
		if (loading) return
		updateBook({ variables: { id, title: inputTitle } })
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
							label="title"
							variant="outlined"
							value={inputTitle}
							onChange={onChange}
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
					</CardActions>
				</form>
			</Card>
		</Box>
	)
}

export default EditBook
