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
import { useUserDispatch } from '../../context/user'
import useStyles from './Notifications.style'

type Props = { anchorEl: HTMLElement | null; onClose: any }

const Notification: React.FC<Props> = ({ anchorEl, onClose }) => {
	const classes = useStyles()
	const { enqueueSnackbar } = useSnackbar()

	const { data, loading } = useGetNotifsQuery({
		variables: { first: 1, orderBy: 'created_DESC' },
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
	})

	const renderNotifs = data?.getNotifs.nodes.length ? (
		data.getNotifs.nodes.map((notif, index) => {
			let emoji = ''
			let action = ''
			let body = ''
			let link = ''

			if (notif.follow) {
				emoji = '👈️'
				action = 'is following you'
				link = `/user/${notif.userSender.id}`
			} else if (notif.review) {
				emoji = '📜️'
				action = 'reviewed your book'
				body = notif.review.content.substr(0, 100)
				link = `/book/${notif.book!.id}`
			} else if (notif.book) {
				emoji = '📑️'
				action = 'wrote a new book'
				body = notif.book.title
				link = `/book/${notif.book.id}`
			}

			return (
				<Box>
					<LinkComponent
						onClick={onClose}
						underline="none"
						component={Link}
						to={link}
					>
						<Typography gutterBottom variant="h6">
							{emoji} {notif.userSender.name} {action}
						</Typography>
					</LinkComponent>
					<Typography gutterBottom variant="subtitle1">
						{formatDistance(new Date(notif.created), new Date())} ago
					</Typography>
					{body ? <Typography variant="body2">{body}</Typography> : ''}

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
