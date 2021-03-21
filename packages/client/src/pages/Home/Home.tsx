import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistance } from 'date-fns'

import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import LinkComponent from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import Rating from '@material-ui/lab/Rating'

import useStyles from './Home.style'
import { useBooksQuery, BooksQuery } from '../../generated/types'

type CardSubheaderProps = { book: ArrayElement<BooksQuery['books']['nodes']> }

const CardSubheader: React.FC<CardSubheaderProps> = ({ book }) => (
	<Typography variant="body2" color="textSecondary">
		By{' '}
		<LinkComponent component={Link} to={`/user/${book.author.id}`}>
			{book.author.name}
		</LinkComponent>
		, {formatDistance(new Date(book.created), new Date())} ago
	</Typography>
)

const options = { variables: { first: 2 } }
const Home: React.FC = () => {
	const { data, loading, error, fetchMore } = useBooksQuery(options)

	const classes = useStyles()

	if (error) return <Typography variant="h5">{error.message}</Typography>
	if (loading) return <Typography variant="h6">Loading data...</Typography>

	return (
		<Box>
			<Grid container spacing={3}>
				{data?.books.nodes.map((book) => (
					<Grid
						className={classes.cardGrid}
						item
						md={4}
						sm={6}
						xs={12}
						key={book.id}
					>
						<Card variant="outlined">
							<CardHeader
								title={book.title}
								avatar={
									<Avatar
										alt={book.author.avatar}
										src={`http://localhost:4200/img/${book.author.avatar}`}
									/>
								}
								subheader={<CardSubheader book={book} />}
							/>
							<CardContent>
								<Typography className={classes.summary}>
									{book.summary}
								</Typography>
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
									Updated {formatDistance(new Date(book.created), new Date())}{' '}
									ago
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
					</Grid>
				))}
			</Grid>

			{data?.books.pageInfo.hasNextPage ? (
				<Button
					color="primary"
					variant="contained"
					disableElevation
					type="button"
					className={classes.moreButton}
					onClick={() =>
						fetchMore({
							variables: { first: 2, after: data.books.pageInfo.endCursor },
						})
					}
				>
					More
				</Button>
			) : (
				''
			)}
		</Box>
	)
}

export default Home
