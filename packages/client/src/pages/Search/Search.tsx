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
	Grid,
	Link as LinkComponent,
	Typography,
	TextField,
} from '@material-ui/core'

import { useSearchLazyQuery, SearchQuery } from '../../generated/types'
import useStyles from './Search.style'

type InputChange = React.ChangeEvent<HTMLInputElement>
const searchDelay = 150

const Search: React.FC = () => {
	const [search, setSearch] = React.useState<string>('')
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
					books: {
						nodes: [...initVal.books.nodes, ...result.books.nodes],
						pageInfo: result.books.pageInfo,
					},
				}
			}),
	})

	React.useEffect(() => {
		let bounce: any = null
		setData(null)

		if (search) {
			bounce = setTimeout(() => {
				doSearch({ variables: { first: 2, search } })
			}, searchDelay)
		}

		return () => clearTimeout(bounce)
	}, [search])

	const onChange = (e: InputChange) => setSearch(e.currentTarget.value)

	const classes = useStyles()

	return (
		<Box>
			<Grid container>
				<Grid item md={6} xs={12}>
					<Card variant="outlined">
						<CardContent>
							<TextField
								size="medium"
								value={search}
								onChange={onChange}
								variant="outlined"
								label="Search..."
								fullWidth
							/>

							<Box className={classes.results}>
								{data?.books.nodes.map((book) => (
									<Card
										key={book.id}
										className={classes.result}
										variant="outlined"
									>
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
												<Button
													variant="outlined"
													type="button"
													color="primary"
												>
													Read
												</Button>
											</LinkComponent>
										</CardActions>
									</Card>
								))}
							</Box>

							{data?.books.pageInfo.hasNextPage ? (
								<Button
									className={classes.more}
									color="primary"
									variant="contained"
									disableElevation
									onClick={() =>
										doSearch({
											variables: {
												first: 2,
												search,
												after: data.books.pageInfo.endCursor,
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
				</Grid>
			</Grid>
		</Box>
	)
}

export default Search
