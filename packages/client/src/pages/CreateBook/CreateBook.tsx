import React from 'react'
import { gql, Reference } from '@apollo/client'
import { useSnackbar } from 'notistack'

import {
	Box,
	Button,
	Grid,
	Card,
	CardHeader,
	CardContent,
	CardActions,
	TextField,
	Typography,
} from '@material-ui/core'

import { useUserState } from '../../context/user'
import { useCreateBookMutation } from '../../generated/types'
import useStyles from './CreateBook.style'

type InputChange = React.ChangeEvent<HTMLInputElement>
type SubmitEvent = React.FormEvent<HTMLFormElement>

const CreateBook: React.FC = () => {
	const [title, setTitle] = React.useState<string>('')
	const [summary, setSummary] = React.useState<string>('')
	const [content, setContent] = React.useState<string>('')

	const { enqueueSnackbar } = useSnackbar()
	const { user } = useUserState()

	const [createBook, { loading }] = useCreateBookMutation({
		onError: (err) => {
			enqueueSnackbar(err.message, { variant: 'error' })
		},
		onCompleted: (data) => {
			if (!data.createBook) return
			enqueueSnackbar(
				`Created ${data.createBook.id} at ${data.createBook.created}`,
				{ variant: 'success' },
			)
		},
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
									summary
									content
									ratingsAverage
									ratingsQuantity
									author {
										id
										name
										avatar
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

	const onTitleChange = (e: InputChange) => setTitle(e.currentTarget.value)
	const onSummaryChange = (e: InputChange) => setSummary(e.currentTarget.value)
	const onContentChange = (e: InputChange) => setContent(e.currentTarget.value)

	const onSubmit = async (e: SubmitEvent) => {
		e.preventDefault()
		if (loading) return
		await createBook({ variables: { title, summary, content } })
	}
	const classes = useStyles()

	if (!user)
		return <Typography variant="h5">You have to be logged in first</Typography>

	return (
		<Box>
			<Grid container>
				<Grid item md={6} xs={12}>
					<form onSubmit={onSubmit}>
						<Card variant="outlined">
							<CardHeader title="Create a book" />
							<CardContent>
								<TextField
									fullWidth
									variant="outlined"
									label="Title"
									value={title}
									onChange={onTitleChange}
									className={classes.input}
								/>
								<TextField
									multiline
									fullWidth
									variant="outlined"
									label="Summary"
									value={summary}
									onChange={onSummaryChange}
									className={classes.input}
								/>
								<TextField
									multiline
									fullWidth
									variant="outlined"
									label="Content"
									value={content}
									onChange={onContentChange}
								/>
							</CardContent>
							<CardActions>
								<Button
									variant="contained"
									disableElevation
									color="primary"
									disabled={loading}
									type="submit"
								>
									Submit
								</Button>
							</CardActions>
						</Card>
					</form>
				</Grid>
			</Grid>
		</Box>
	)
}

export default CreateBook
