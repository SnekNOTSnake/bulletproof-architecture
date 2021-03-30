import React from 'react'
import { useSnackbar } from 'notistack'
import { formatDistance } from 'date-fns'
import { Link } from 'react-router-dom'

import {
	Box,
	Divider,
	Link as LinkComponent,
	Popover,
	Typography,
} from '@material-ui/core'

import { useReadNotifsMutation, useGetNotifsQuery } from '../../generated/types'
import { useUserState, useUserDispatch } from '../../context/user'
import useStyles from './Notifications.style'

type Props = { anchorEl: HTMLElement | null; onClose: any }

const Notification: React.FC<Props> = ({ anchorEl, onClose }) => {
	const classes = useStyles()
	const { enqueueSnackbar } = useSnackbar()
	const state = useUserState()
	const userDispatch = useUserDispatch()

	const { data, loading } = useGetNotifsQuery({
		variables: { first: 4, orderBy: 'created_DESC' },
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
	})

	const [read] = useReadNotifsMutation({
		onCompleted: (data) => {
			userDispatch({
				type: 'SET_USER',
				payload: { ...state.data!, newNotifs: 0 },
			})
		},
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
	})

	React.useEffect(() => {
		// Also prevents unnecessary `readRequest` to server
		if (anchorEl && state.data?.newNotifs) read()
	}, [anchorEl])

	const renderNotifs = data?.getNotifs.nodes.length ? (
		data.getNotifs.nodes.map((notif, index) => {
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
				<Box>
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

					{index + 1 < data.getNotifs.nodes.length ? (
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
			</Box>
		</Popover>
	)
}

export default Notification
