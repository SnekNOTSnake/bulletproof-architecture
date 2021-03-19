import React from 'react'
import { ApolloError, Reference } from '@apollo/client'
import { formatDistance } from 'date-fns'

import Alert from '@material-ui/lab/Alert'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Rating from '@material-ui/lab/Rating'

import {
	ReviewsQuery,
	useUpdateReviewMutation,
	useDeleteReviewMutation,
} from '../../generated/types'
import useStyles from './Review.style'

type InputChange = React.ChangeEvent<HTMLInputElement>
type Props = { review: ArrayElement<ReviewsQuery['reviews']['nodes']> }
type FormSubmit = React.FormEvent<HTMLFormElement>

const Review: React.FC<Props> = ({ review }) => {
	const [isEditing, setIsEditing] = React.useState<boolean>(false)
	const [rating, setRating] = React.useState<number>(review.rating)
	const [content, setContent] = React.useState<string>(review.content)
	const [error, setError] = React.useState<ApolloError | null>(null)

	const ratingChange = (e: InputChange) =>
		setRating(Number(e.currentTarget.value))
	const contentChange = (e: InputChange) => setContent(e.currentTarget.value)

	const [remove, { loading: removeLoading }] = useDeleteReviewMutation({
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
		onError: (err) => setError(err),
		onCompleted: () => setError(null),
	})
	const [update, { loading }] = useUpdateReviewMutation({
		onError: (err) => setError(err),
		onCompleted: () => {
			setError(null)
			setIsEditing(false)
		},
	})

	const openEdit = () => setIsEditing(true)
	const closeEdit = () => setIsEditing(false)
	const onSubmit = async (e: FormSubmit) => {
		e.preventDefault()
		await update({
			variables: { id: review.id, rating, content },
		})
	}

	const classes = useStyles()

	if (isEditing)
		return (
			<Card className={classes.review} variant="outlined">
				<form onSubmit={onSubmit}>
					<CardContent>
						{error ? (
							<Alert
								onClose={() => setError(null)}
								className={classes.alert}
								severity="error"
							>
								{error.message}
							</Alert>
						) : (
							''
						)}

						<TextField
							fullWidth
							variant="outlined"
							value={rating}
							onChange={ratingChange}
							type="number"
							inputProps={{ min: 1, max: 5 }}
							className={classes.input}
							label="Rating"
						/>
						<TextField
							fullWidth
							variant="outlined"
							value={content}
							onChange={contentChange}
							multiline
							label="Content"
						/>
					</CardContent>
					<CardActions>
						<Button
							disabled={loading || removeLoading}
							color="primary"
							type="submit"
						>
							Submit
						</Button>
						<Button
							disabled={loading || removeLoading}
							onClick={closeEdit}
							color="primary"
							type="button"
						>
							Cancel
						</Button>
					</CardActions>
				</form>
			</Card>
		)

	return (
		<Card className={classes.review} variant="outlined">
			<CardHeader
				title={`${review.rating} stars, by ${review.author.name}`}
				subheader={`${formatDistance(
					new Date(review.created),
					new Date(),
				)} ago`}
			/>
			<CardContent>
				{error ? (
					<Alert
						onClose={() => setError(null)}
						className={classes.alert}
						severity="error"
					>
						{error.message}
					</Alert>
				) : (
					''
				)}

				<Typography className={classes.content}>{review.content}</Typography>
				<Rating readOnly value={review.rating} precision={0.5} />
			</CardContent>
			<CardActions>
				<Button
					variant="outlined"
					onClick={() => remove({ variables: { id: review.id } })}
					color="primary"
					type="button"
				>
					Delete
				</Button>
				<Button
					variant="outlined"
					onClick={openEdit}
					color="primary"
					type="button"
				>
					Edit
				</Button>
			</CardActions>
		</Card>
	)
}

export default Review
