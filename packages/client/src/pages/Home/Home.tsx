import React from 'react'
import { useSnackbar } from 'notistack'
import { useApolloClient } from '@apollo/client'

import {
	Box,
	Button,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from '@material-ui/core'

import useStyles from './Home.style'
import { useBooksQuery } from '../../generated/types'
import SimpleBook from '../../components/SimpleBook'

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

			{!data?.books.nodes.length ? (
				<Grid className={classes.noBook} item xs={12}>
					<Typography variant="h5">No data to display</Typography>
				</Grid>
			) : (
				data?.books.nodes.map((book) => (
					<SimpleBook key={book.id} book={book} />
				))
			)}

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
