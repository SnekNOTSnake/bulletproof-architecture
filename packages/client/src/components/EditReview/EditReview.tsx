import React from 'react'
import { useSnackbar } from 'notistack'

import {
	Button,
	Card,
	CardContent,
	CardActions,
	TextField,
} from '@material-ui/core'

import { useUpdateReviewMutation, ReviewsQuery } from '../../generated/types'
import useStyles from './EditReview.style'

type InputChange = React.ChangeEvent<HTMLInputElement>
type FormSubmit = React.FormEvent<HTMLFormElement>
type Props = {
	review: ArrayElement<ReviewsQuery['reviews']['nodes']>
	closeEdit: Function
}

const EditReview: React.FC<Props> = ({ closeEdit, review }) => {
	const [rating, setRating] = React.useState<number>(review.rating)
	const [content, setContent] = React.useState<string>(review.content)

	const { enqueueSnackbar } = useSnackbar()

	const ratingChange = (e: InputChange) =>
		setRating(Number(e.currentTarget.value))
	const contentChange = (e: InputChange) => setContent(e.currentTarget.value)

	const [update, { loading }] = useUpdateReviewMutation({
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
		onCompleted: () => {
			enqueueSnackbar('Review updated', { variant: 'success' })
			closeEdit()
		},
	})

	const onSubmit = async (e: FormSubmit) => {
		e.preventDefault()
		await update({
			variables: { id: review.id, rating, content },
		})
	}

	const classes = useStyles()

	return (
		<Card className={classes.review} variant="outlined">
			<form onSubmit={onSubmit}>
				<CardContent>
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
					<Button disabled={loading} color="primary" type="submit">
						Submit
					</Button>
					<Button
						disabled={loading}
						onClick={() => closeEdit()}
						color="primary"
						type="button"
					>
						Cancel
					</Button>
				</CardActions>
			</form>
		</Card>
	)
}

export default EditReview
