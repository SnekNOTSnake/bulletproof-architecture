import React from 'react'
import { useSnackbar } from 'notistack'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'

import { useReviewsQuery } from '../../generated/types'
import Review from '../Review'
import AddReview from '../CreateReview'
import useStyles from './Reviews.style'

type Props = { bookId: string }

const Reviews: React.FC<Props> = ({ bookId }) => {
	const [addReview, setAddReview] = React.useState<boolean>(false)

	const { enqueueSnackbar } = useSnackbar()

	const { data, loading, fetchMore } = useReviewsQuery({
		variables: { first: 1, where: { book: bookId } },
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
		// fetchPolicy: 'no-cache',
	})

	const openForm = () => setAddReview(true)
	const closeForm = () => setAddReview(false)

	const classes = useStyles()

	if (loading) return <Typography variant="h5">Loading reviews...</Typography>

	return (
		<Box className={classes.root}>
			<Card variant="outlined">
				<CardHeader title="Reviews" />
				<CardContent>
					<Box className={classes.reviews}>
						{addReview ? (
							<AddReview bookId={bookId} onClose={closeForm} />
						) : (
							<Button
								className={classes.addReviewButton}
								type="button"
								onClick={openForm}
								color="primary"
								variant="outlined"
							>
								Add review
							</Button>
						)}

						{data?.reviews.nodes.length === 0 &&
						!data.reviews.pageInfo.hasNextPage ? (
							<Typography variant="h6">No reviews, be the first!</Typography>
						) : (
							''
						)}

						{data?.reviews.nodes.map((review) => (
							<Review key={review.id} review={review} />
						))}

						{data?.reviews.pageInfo.hasNextPage ? (
							<Button
								onClick={() =>
									fetchMore({
										variables: {
											first: 1,
											after: data.reviews.pageInfo.endCursor,
											where: { book: bookId },
										},
									})
								}
								disableElevation
								variant="contained"
								color="primary"
							>
								More
							</Button>
						) : (
							''
						)}
					</Box>
				</CardContent>
			</Card>
		</Box>
	)
}

export default Reviews
