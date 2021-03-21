import React from 'react'
import { Link } from 'react-router-dom'
import { Reference } from '@apollo/client'
import { formatDistance } from 'date-fns'
import { useSnackbar } from 'notistack'

import {
	Button,
	Card,
	CardHeader,
	CardContent,
	CardActions,
	Link as LinkComponent,
	Typography,
} from '@material-ui/core'
import { Rating } from '@material-ui/lab'

import EditReview from '../EditReview'
import { ReviewsQuery, useDeleteReviewMutation } from '../../generated/types'
import useStyles from './Review.style'

type Props = { review: ArrayElement<ReviewsQuery['reviews']['nodes']> }

const CardSubheader: React.FC<Props> = ({ review }) => (
	<Typography variant="body2" color="textSecondary">
		By{' '}
		<LinkComponent component={Link} to={`/user/${review.author.id}`}>
			{review.author.name}
		</LinkComponent>
		, {formatDistance(new Date(review.created), new Date())} ago
	</Typography>
)

const Review: React.FC<Props> = ({ review }) => {
	const [isEditing, setIsEditing] = React.useState<boolean>(false)

	const { enqueueSnackbar } = useSnackbar()

	const [remove, { loading }] = useDeleteReviewMutation({
		update: (cache) => {
			cache.modify({
				fields: {
					reviews: (existing, { readField }) => {
						const nodes: Reference[] = []
						if (existing.nodes) {
							const filtered = existing.nodes.filter(
								(nodeRef: any) => readField('id', nodeRef) !== review.id,
							)
							nodes.push(...filtered)
						}

						return { ...existing, nodes }
					},
				},
			})
		},
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
		onCompleted: () =>
			enqueueSnackbar('Review deleted', { variant: 'success' }),
	})

	const openEdit = () => setIsEditing(true)
	const closeEdit = () => setIsEditing(false)

	const classes = useStyles()

	if (isEditing) return <EditReview closeEdit={closeEdit} review={review} />

	return (
		<Card className={classes.review} variant="outlined">
			<CardHeader
				title={review.author.name}
				subheader={<CardSubheader review={review} />}
			/>
			<CardContent>
				<Typography className={classes.content}>{review.content}</Typography>
				<Rating readOnly value={review.rating} precision={0.5} />
			</CardContent>
			<CardActions>
				<Button
					variant="outlined"
					onClick={() => remove({ variables: { id: review.id } })}
					color="primary"
					type="button"
					disabled={loading}
				>
					Delete
				</Button>
				<Button
					variant="outlined"
					onClick={openEdit}
					color="primary"
					type="button"
					disabled={loading}
				>
					Edit
				</Button>
			</CardActions>
		</Card>
	)
}

export default Review
