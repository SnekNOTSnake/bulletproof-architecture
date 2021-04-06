import React from 'react'
import { useSnackbar } from 'notistack'

import { Box, Button, Grid, Typography } from '@material-ui/core'

import { useUsersQuery } from '../../generated/types'
import SimplePerson from '../../components/SimplePerson'
import useStyles from './People.style'

const People: React.FC = () => {
	const [loadingMore, setLoadingMore] = React.useState(false)

	const { enqueueSnackbar } = useSnackbar()

	const { data, loading, fetchMore } = useUsersQuery({
		variables: { first: 2, orderBy: 'created_DESC' },
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
	})

	const classes = useStyles()

	const onFetchMore = async () => {
		try {
			if (!data) return

			setLoadingMore(true)
			await fetchMore({
				variables: { first: 2, after: data.users.pageInfo.endCursor },
			})
			setLoadingMore(false)
		} catch (err) {
			enqueueSnackbar(err.message, { variant: 'error' })
		}
	}

	if (loading)
		return (
			<Box p={3}>
				<Typography>Loading data...</Typography>
			</Box>
		)

	return (
		<Box>
			<Grid container spacing={2}>
				{data?.users.nodes.map((user) => (
					<Grid xs={12} md={6} item key={user.id}>
						<SimplePerson person={user} />
					</Grid>
				))}
			</Grid>

			{data?.users.pageInfo.hasNextPage ? (
				<Button
					color="primary"
					variant="contained"
					disableElevation
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

export default People
