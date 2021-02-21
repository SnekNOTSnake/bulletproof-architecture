import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Reference } from '@apollo/client'
import { formatDistance } from 'date-fns'

import Alert from '@material-ui/lab/Alert'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { useBookQuery, useDeleteBookMutation } from '../../generated/types'
import EditBook from '../EditBook'
import useStyles from './Book.style'

type Props = RouteComponentProps<{ id: string }>

const Book: React.FC<Props> = ({ match, history }) => {
	const id = match.params.id

	const [isEditing, setIsEditing] = React.useState(false)
	const [mutationError, setMutationError] = React.useState<string>('')
	const { loading, data, error } = useBookQuery({ variables: { id } })

	const toggleEditing = () => setIsEditing((initVal) => !initVal)

	const [deleteBook, { loading: deleteLoading }] = useDeleteBookMutation({
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

	const classes = useStyles()

	if (error) return <Typography variant="h5">{error.message}</Typography>
	if (loading) return <Typography variant="h6">Loading data...</Typography>
	if (!data?.book)
		return <Typography variant="h5">No book with that ID</Typography>

	return (
		<Box>
			<Grid container>
				<Grid item md={6} xs={12}>
					<Card>
						<CardHeader
							title={data.book.title}
							subheader={`By ${data.book.author.name}, ${formatDistance(
								new Date(data.book.created),
								new Date(),
							)} ago`}
						/>
						<CardContent>
							<Typography>
								Updated{' '}
								{formatDistance(new Date(data.book.created), new Date())} ago
							</Typography>
							{mutationError ? (
								<Alert
									className={classes.alert}
									onClose={() => setMutationError('')}
									severity="error"
								>
									{mutationError}
								</Alert>
							) : (
								''
							)}
						</CardContent>
						<CardActions>
							<Button
								disabled={deleteLoading}
								onClick={() => deleteBook({ variables: { id } })}
								type="button"
								variant="contained"
								color="primary"
							>
								Delete
							</Button>
							<Button
								onClick={toggleEditing}
								type="button"
								variant="contained"
								color="primary"
							>
								{isEditing ? 'Close edit' : 'Edit'}
							</Button>
						</CardActions>
					</Card>
					{isEditing ? (
						<EditBook id={data.book.id} title={data.book.title} />
					) : (
						''
					)}
				</Grid>
			</Grid>
		</Box>
	)
}

export default Book
