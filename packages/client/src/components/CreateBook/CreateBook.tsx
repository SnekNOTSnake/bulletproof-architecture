import React from 'react'
import { gql, Reference } from '@apollo/client'

import Alert from '@material-ui/lab/Alert'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import { useCreateBookMutation } from '../../generated/types'
import useStyles from './CreateBook.style'

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
	const classes = useStyles()

	if (!user) return <div>You have to be logged in first</div>

	return (
		<Box>
			<Grid container>
				<Grid item md={6} xs={12}>
					<form onSubmit={onSubmit}>
						<Card>
							<CardHeader title="Create a book" />
							<CardContent>
								<Box className={classes.alert}>
									{error ? <Alert severity="error">{error.message}</Alert> : ''}
									{data?.createBook ? (
										<Alert>
											Created {data.createBook.id} at {data.createBook.created}
										</Alert>
									) : (
										''
									)}
								</Box>
								<TextField
									fullWidth
									variant="outlined"
									label="Title"
									value={title}
									onChange={onChange}
								/>
							</CardContent>
							<CardActions>
								<Button
									variant="contained"
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
