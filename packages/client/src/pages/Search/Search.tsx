import React from 'react'
import { formatDistance } from 'date-fns'
import { Link } from 'react-router-dom'
import { useSnackbar } from 'notistack'

import {
	Box,
	Button,
	Card,
	CardHeader,
	CardContent,
	CardActions,
	Link as LinkComponent,
	Typography,
	TextField,
} from '@material-ui/core'

import { useSearchLazyQuery, SearchQuery } from '../../generated/types'
import useStyles from './Search.style'

type InputChange = React.ChangeEvent<HTMLInputElement>
const searchDelay = 150

const Search: React.FC = () => {
	const [query, setQuery] = React.useState<string>('')
	const [data, setData] = React.useState<SearchQuery | null>(null)

	const { enqueueSnackbar } = useSnackbar()

	const [doSearch, { loading }] = useSearchLazyQuery({
		fetchPolicy: 'no-cache',
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
		onCompleted: (result) =>
			setData((initVal) => {
				if (!initVal) return result
				return {
					...initVal,
					searchBooks: {
						nodes: [...initVal.searchBooks.nodes, ...result.searchBooks.nodes],
						pageInfo: result.searchBooks.pageInfo,
					},
				}
			}),
	})

	React.useEffect(() => {
		let bounce: any = null
		setData(null)

		if (query) {
			bounce = setTimeout(() => {
				doSearch({ variables: { first: 2, query } })
			}, searchDelay)
		}

		return () => clearTimeout(bounce)
	}, [query])

	const onChange = (e: InputChange) => setQuery(e.currentTarget.value)

	const classes = useStyles()

	return (
		<Box>
			<Card variant="outlined">
				<CardContent>
					<TextField
						size="medium"
						value={query}
						onChange={onChange}
						variant="outlined"
						label="Search..."
						fullWidth
					/>

					<Box className={classes.results}>
						{data?.searchBooks.nodes.map((book) => (
							<Card key={book.id} className={classes.result} variant="outlined">
								<CardHeader
									title={book.title}
									subheader={`By ${book.author.name}, ${formatDistance(
										new Date(book.created),
										new Date(),
									)} ago`}
								/>
								<CardContent>
									<Typography>{book.summary}</Typography>
								</CardContent>
								<CardActions>
									<LinkComponent component={Link} to={`/book/${book.id}`}>
										<Button variant="outlined" type="button" color="primary">
											Read
										</Button>
									</LinkComponent>
								</CardActions>
							</Card>
						))}
					</Box>

					{data?.searchBooks.pageInfo.hasNextPage ? (
						<Button
							className={classes.more}
							color="primary"
							variant="contained"
							disableElevation
							onClick={() =>
								doSearch({
									variables: {
										first: 2,
										query,
										after: data.searchBooks.pageInfo.endCursor,
									},
								})
							}
						>
							More
						</Button>
					) : (
						''
					)}
				</CardContent>
			</Card>
		</Box>
	)
}

export default Search
