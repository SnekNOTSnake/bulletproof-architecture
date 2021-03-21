import React from 'react'
import { Reference, gql } from '@apollo/client'
import { useSnackbar } from 'notistack'

import {
	Button,
	Card,
	CardHeader,
	CardContent,
	CardActions,
	TextField,
} from '@material-ui/core'

import { useCreateReviewMutation } from '../../generated/types'
import useStyles from './CreateReview.style'

type Props = { onClose: Function; bookId: string }
type InputChange = React.ChangeEvent<HTMLInputElement>
type FormSubmit = React.FormEvent<HTMLFormElement>

const AddReview: React.FC<Props> = ({ onClose, bookId }) => {
	const [rating, setRating] = React.useState<number>(5)
	const [content, setContent] = React.useState<string>('')

	const { enqueueSnackbar } = useSnackbar()

	const [create, { loading }] = useCreateReviewMutation({
		update: (cache, { data }) => {
			cache.modify({
				fields: {
					reviews: (existing) => {
						const nodes: Reference[] = []
						if (existing.nodes) nodes.push(...existing.nodes)

						const newReviewRef = cache.writeFragment({
							data: data?.createReview,
							variables: { where: { book: bookId } },
							fragment: gql`
								fragment NewReview on Review {
									id
									author {
										id
										name
									}
									content
									rating
									created
								}
							`,
						})

						nodes.unshift(newReviewRef!)

						return { ...existing, nodes }
					},
				},
			})
		},
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
		onCompleted: () => {
			onClose()
		},
	})

	const ratingChange = (e: InputChange) =>
		setRating(Number(e.currentTarget.value))
	const contentChange = (e: InputChange) => setContent(e.currentTarget.value)

	const onCancel = () => onClose()
	const onSubmit = (e: FormSubmit) => {
		e.preventDefault()
		create({ variables: { book: bookId, rating, content } })
	}

	const classes = useStyles()

	return (
		<Card className={classes.root} variant="outlined">
			<form onSubmit={onSubmit}>
				<CardHeader title="Add review" />
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
						onClick={onCancel}
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

export default AddReview
