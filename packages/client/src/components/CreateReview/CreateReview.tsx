import React from 'react'
import { ApolloError, Reference, gql } from '@apollo/client'

import Alert from '@material-ui/lab/Alert'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import TextField from '@material-ui/core/TextField'

import { useCreateReviewMutation } from '../../generated/types'
import useStyles from './CreateReview.style'

type Props = { onClose: Function; bookId: string }
type InputChange = React.ChangeEvent<HTMLInputElement>
type FormSubmit = React.FormEvent<HTMLFormElement>

const AddReview: React.FC<Props> = ({ onClose, bookId }) => {
	const [rating, setRating] = React.useState<number>(5)
	const [content, setContent] = React.useState<string>('')
	const [error, setError] = React.useState<ApolloError | null>(null)

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
		onError: (err) => setError(err),
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
