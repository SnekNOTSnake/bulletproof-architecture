import React from 'react'
import { useSnackbar } from 'notistack'
import { formatDistance } from 'date-fns'
import { Link } from 'react-router-dom'

import {
	Box,
	Button,
	Divider,
	Link as LinkComponent,
	Popover,
	Typography,
} from '@material-ui/core'

import { useReadNotifsMutation, useNotifsQuery } from '../../generated/types'
import { useUserState, useUserDispatch } from '../../context/user'
import useStyles from './Notifications.style'

type Props = { anchorEl: HTMLElement | null; onClose: any }

const Notification: React.FC<Props> = ({ anchorEl, onClose }) => {
	const classes = useStyles()
	const { enqueueSnackbar } = useSnackbar()
	const state = useUserState()
	const userDispatch = useUserDispatch()

	const [loadingMore, setLoadingMore] = React.useState(false)

	const { data, loading, fetchMore } = useNotifsQuery({
		variables: { first: 1, orderBy: 'created_DESC' },
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
	})

	const onFetchMore = async () => {
		if (!data) return

		setLoadingMore(true)
		await fetchMore({
			variables: { first: 1, after: data.notifs.pageInfo.endCursor },
		})
		setLoadingMore(false)
	}

	const [read] = useReadNotifsMutation({
		onCompleted: (data) => {
			if (!data.readNotifs) return
			userDispatch({ type: 'RESET_NOTIFS' })
		},
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
	})

	React.useEffect(() => {
		// Also prevents unnecessary `readRequest` to server
		if (anchorEl && state.data?.newNotifs) read()
	}, [anchorEl])

	const renderNotifs = data?.notifs.nodes.length ? (
		data.notifs.nodes.map((notif, index) => {
			let emoji = ''
			let action = ''
			let body = ''
			let link = ''

			switch (notif.type) {
				case 'FOLLOW':
					emoji = '👈️'
					action = 'is following you'
					link = `/user/${notif.userSender.id}`
					break

				case 'REVIEW':
					emoji = '📜️'
					action = 'reviewed your book'
					body = notif.review
						? notif.review.content.substr(0, 100)
						: 'Review is deleted'
					link = notif.book ? `/book/${notif.book.id}` : '/'
					break

				case 'NEW_BOOK':
					emoji = '📑️'
					action = 'wrote a new book'
					body = notif.book ? notif.book.title : 'Book is deleted'
					link = notif.book ? `/book/${notif.book.id}` : '/'
					break

				default:
					break
			}

			return (
				<Box key={notif.id}>
					<LinkComponent
						onClick={onClose}
						underline="none"
						component={Link}
						to={link}
					>
						<Typography gutterBottom variant="body1">
							{emoji} {notif.userSender.name} {action}
						</Typography>
					</LinkComponent>
					{body ? (
						<Typography gutterBottom variant="body1">
							{body}
						</Typography>
					) : (
						''
					)}
					<Typography color="textSecondary" variant="body2">
						{formatDistance(new Date(notif.created), new Date())} ago
					</Typography>

					{index + 1 < data.notifs.nodes.length ? (
						<Divider className={classes.divider} />
					) : (
						''
					)}
				</Box>
			)
		})
	) : (
		<Typography>No data to display</Typography>
	)

	return (
		<Popover
			elevation={6}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
			transformOrigin={{ vertical: 'top', horizontal: 'center' }}
			open={Boolean(anchorEl)}
			anchorEl={anchorEl}
			onClose={onClose}
		>
			<Box className={classes.popover}>
				{loading ? <Typography>Loading data...</Typography> : renderNotifs}

				{data?.notifs.pageInfo.hasNextPage ? (
					<Button
						color="primary"
						variant="contained"
						disableElevation
						type="button"
						disabled={loadingMore}
						onClick={onFetchMore}
						size="small"
						className={classes.moreButton}
					>
						More
					</Button>
				) : (
					''
				)}
			</Box>
		</Popover>
	)
}

export default Notification
