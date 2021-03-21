import React from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import { Reference } from '@apollo/client'
import { formatDistance } from 'date-fns'
import { useSnackbar } from 'notistack'

import {
	Box,
	Button,
	Grid,
	Card,
	CardHeader,
	CardContent,
	CardActions,
	Link as LinkComponent,
	Typography,
} from '@material-ui/core'
import { Rating } from '@material-ui/lab'

import { useBookQuery, useDeleteBookMutation } from '../../generated/types'
import Reviews from '../../components/Reviews'
import EditBook from '../../components/EditBook'
import useStyles from './Book.style'

type Props = RouteComponentProps<{ id: string }>

const Book: React.FC<Props> = ({ match, history }) => {
	const id = match.params.id

	const { enqueueSnackbar } = useSnackbar()

	const [showReviews, setShowReviews] = React.useState<boolean>(false)
	const [isEditing, setIsEditing] = React.useState(false)
	const { loading, data } = useBookQuery({
		variables: { id },
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
	})

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
		onCompleted: () => {
			enqueueSnackbar(`Deleted book ${id}`, { variant: 'success' })
			history.push('/')
		},
		onError: (error) => enqueueSnackbar(error.message, { variant: 'error' }),
	})

	const classes = useStyles()

	if (loading) return <Typography variant="h6">Loading data...</Typography>
	if (!data?.book)
		return <Typography variant="h5">No book to display</Typography>

	const cardSubheader = (
		<Typography variant="body2" color="textSecondary">
			By{' '}
			<LinkComponent component={Link} to={`/user/${data.book.author.id}`}>
				{data.book.author.name}
			</LinkComponent>
			, {formatDistance(new Date(data.book.created), new Date())} ago
		</Typography>
	)

	return (
		<Box>
			<Grid container>
				<Grid item md={6} xs={12}>
					<Card variant="outlined">
						<CardHeader title={data.book.title} subheader={cardSubheader} />

						<CardContent>
							<Typography variant="body1" className={classes.summary}>
								{data.book.summary}
							</Typography>
							<Typography className={classes.content}>
								{data.book.content}
							</Typography>

							<Box>
								<Box className={classes.rating}>
									<Rating
										className={classes.stars}
										readOnly
										value={data.book.ratingsAverage}
										precision={0.5}
									/>
									<Box>({data.book.ratingsQuantity})</Box>
								</Box>
								<Typography color="textSecondary">
									Updated{' '}
									{formatDistance(new Date(data.book.created), new Date())} ago
								</Typography>
							</Box>
						</CardContent>

						<CardActions>
							<Button
								disabled={deleteLoading}
								onClick={() => deleteBook({ variables: { id } })}
								type="button"
								color="primary"
							>
								Delete
							</Button>
							<Button onClick={toggleEditing} type="button" color="primary">
								{isEditing ? 'Close edit' : 'Edit'}
							</Button>
							{showReviews ? (
								''
							) : (
								<Button
									onClick={() => setShowReviews(true)}
									type="button"
									color="primary"
								>
									Show Reviews
								</Button>
							)}
						</CardActions>
					</Card>

					{isEditing ? <EditBook id={data.book.id} book={data.book} /> : ''}

					{showReviews ? <Reviews bookId={data.book.id} /> : ''}
				</Grid>
			</Grid>
		</Box>
	)
}

export default Book
