import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistance } from 'date-fns'
import { useSnackbar } from 'notistack'
import { useApolloClient } from '@apollo/client'

import {
	Avatar,
	Box,
	Button,
	Card,
	CardHeader,
	CardContent,
	CardActions,
	FormControl,
	Grid,
	InputLabel,
	Link as LinkComponent,
	MenuItem,
	Select,
	Typography,
} from '@material-ui/core'
import { Rating } from '@material-ui/lab'

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

type InputChange = React.ChangeEvent<any>
type FetchMode = 'by-anyone' | 'by-followed-users'

const Home: React.FC = () => {
	const [fetchMode, setFetchMode] = React.useState<FetchMode>(() => {
		const stored: any = localStorage.getItem('fetch-mode')
		return stored || 'by-anyone'
	})

	React.useEffect(() => {
		localStorage.setItem('fetch-mode', fetchMode)
	}, [fetchMode])

	const [loadingMore, setLoadingMore] = React.useState(false)

	const { enqueueSnackbar } = useSnackbar()
	const apolloClient = useApolloClient()

	const { data, loading, fetchMore } = useBooksQuery({
		variables: { first: 1, byFollowings: fetchMode === 'by-followed-users' },
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
	})

	const classes = useStyles()

	const fetchModeChange = (e: InputChange) => {
		setFetchMode(e.target.value as any)
		apolloClient.cache.modify({
			broadcast: false,
			fields: { books: (existing) => ({}) },
		})
	}

	if (loading) return <Typography variant="h5">Loading data...</Typography>

	const onFetchMore = async () => {
		if (!data) return

		setLoadingMore(true)
		await fetchMore({
			variables: { first: 1, after: data.books.pageInfo.endCursor },
		})
		setLoadingMore(false)
	}

	return (
		<Box>
			<Box>
				<FormControl
					size="small"
					variant="outlined"
					className={classes.formControl}
				>
					<InputLabel id="get-books">Get books</InputLabel>
					<Select
						labelId="get-books"
						value={fetchMode}
						label="Get books"
						onChange={fetchModeChange}
					>
						<MenuItem value="by-anyone">By anyone</MenuItem>
						<MenuItem value="by-followed-users">By followed users</MenuItem>
					</Select>
				</FormControl>
			</Box>
			<Grid container spacing={3}>
				{!data?.books.nodes.length ? (
					<Grid className={classes.noBook} item xs={12}>
						<Typography variant="h5">No data to display</Typography>
					</Grid>
				) : (
					data?.books.nodes.map((book) => (
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
					))
				)}
			</Grid>

			{data?.books.pageInfo.hasNextPage ? (
				<Button
					color="primary"
					variant="contained"
					disableElevation
					type="button"
					disabled={loadingMore}
					className={classes.moreButton}
					onClick={onFetchMore}
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
