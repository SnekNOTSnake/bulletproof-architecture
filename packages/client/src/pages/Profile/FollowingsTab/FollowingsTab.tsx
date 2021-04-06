import React from 'react'
import { useSnackbar } from 'notistack'

import { Box, Button, Grid, Typography } from '@material-ui/core'

import { useGetFollowingsQuery } from '../../../generated/types'
import useStyles from './FollowingsTab.style'
import SimplePerson from '../../../components/SimplePerson'

type Props = { userId: string }

const FollowingsTab: React.FC<Props> = ({ userId }) => {
	const { enqueueSnackbar } = useSnackbar()

	const { data, loading, fetchMore } = useGetFollowingsQuery({
		variables: {
			first: 1,
			orderBy: 'created_DESC',
			where: { follower: userId },
		},
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
	})

	const classes = useStyles()

	if (loading)
		return (
			<Box p={3}>
				<Typography>Loading data...</Typography>
			</Box>
		)

	return (
		<Box p={3}>
			<Grid container spacing={2}>
				{data?.getFollows.nodes.map((follow) => (
					<Grid item xs={12} md={6}>
						<SimplePerson person={follow.following} />
					</Grid>
				))}
			</Grid>

			{data?.getFollows.pageInfo.hasNextPage ? (
				<Button
					color="primary"
					variant="contained"
					disableElevation
					className={classes.moreButton}
					onClick={() =>
						fetchMore({
							variables: {
								first: 1,
								after: data?.getFollows.pageInfo.endCursor,
								where: { follower: userId },
							},
						}).catch((err) =>
							enqueueSnackbar(err.message, { variant: 'error' }),
						)
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

export default FollowingsTab
