import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistance } from 'date-fns'

import {
	Avatar,
	Box,
	Button,
	Typography,
	Card,
	CardHeader,
	CardMedia,
	CardContent,
	CardActions,
	Link as LinkComponent,
} from '@material-ui/core'
import { Rating } from '@material-ui/lab'

import { BooksQuery } from '../../generated/types'
import useStyles from './SimpleBook.style'

type Props = { book: ArrayElement<BooksQuery['books']['nodes']> }

const SimpleBook: React.FC<Props> = ({ book }) => {
	const classes = useStyles()

	return (
		<Card key={book.id} className={classes.cardGrid} variant="outlined">
			<CardHeader
				title={book.title}
				avatar={
					<Avatar
						alt={book.author.avatar}
						src={`http://localhost:4200/img/${book.author.avatar}`}
					/>
				}
				subheader={
					<Typography variant="body2" color="textSecondary">
						By{' '}
						<LinkComponent component={Link} to={`/user/${book.author.id}`}>
							{book.author.name}
						</LinkComponent>
						, {formatDistance(new Date(book.created), new Date())} ago
					</Typography>
				}
			/>

			<CardMedia
				className={classes.cardMedia}
				image={`https://picsum.photos/800/400?random&t=${book.id}`}
				title="Placeholder image"
			/>

			<CardContent>
				<Typography className={classes.summary}>{book.summary}</Typography>
				<Box className={classes.rating}>
					<Rating
						className={classes.stars}
						readOnly
						value={book.ratingsAverage}
						precision={0.5}
					/>
					<Box>({book.ratingsQuantity})</Box>
				</Box>
				<Typography color="textSecondary">
					Updated {formatDistance(new Date(book.created), new Date())} ago
				</Typography>
			</CardContent>

			<CardActions>
				<LinkComponent
					underline="none"
					component={Link}
					to={`/book/${book.id}`}
				>
					<Button color="inherit">Details</Button>
				</LinkComponent>
			</CardActions>
		</Card>
	)
}

export default SimpleBook
