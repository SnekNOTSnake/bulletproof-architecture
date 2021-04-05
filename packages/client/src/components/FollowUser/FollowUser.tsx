import React from 'react'
import { useSnackbar } from 'notistack'

import { IconButton } from '@material-ui/core'
import {
	PersonAdd as PersonAddIcon,
	PersonAddDisabled as PersonAddDisabledIcon,
} from '@material-ui/icons'

import {
	UserQuery,
	useFollowUserMutation,
	useUnfollowUserMutation,
} from '../../generated/types'

type Props = { user: UserQuery['user']; [other: string]: any }

const FollowUser: React.FC<Props> = ({ user, ...other }) => {
	const { enqueueSnackbar } = useSnackbar()

	const [doFollow, { loading: followLoading }] = useFollowUserMutation({
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
	})

	const [doUnfollow, { loading: unfollowLoading }] = useUnfollowUserMutation({
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
	})

	const onClick = () => {
		if (!user)
			return enqueueSnackbar('Something went wrong, try refresh', {
				variant: 'error',
			})

		if (user.isFollowing)
			return doUnfollow({ variables: { following: user.id } })
		return doFollow({ variables: { following: user.id } })
	}

	return (
		<IconButton
			{...other}
			onClick={onClick}
			disabled={followLoading || unfollowLoading}
		>
			{user?.isFollowing ? <PersonAddDisabledIcon /> : <PersonAddIcon />}
		</IconButton>
	)
}

export default FollowUser
