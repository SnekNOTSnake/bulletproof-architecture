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

import useStyles from './Home.style'
import { useBooksQuery } from '../../generated/types'

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
						<Card>
							<CardHeader
								title={book.title}
								avatar={
									<Avatar
										alt={book.author.avatar}
										src={`http://localhost:4200/img/${book.author.avatar}`}
									/>
								}
								subheader={`By ${book.author.name}, ${formatDistance(
									new Date(book.created),
									new Date(),
								)} ago`}
							/>
							<CardContent>
								<Typography className={classes.summary}>
									{book.summary}
								</Typography>
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
					type="button"
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
