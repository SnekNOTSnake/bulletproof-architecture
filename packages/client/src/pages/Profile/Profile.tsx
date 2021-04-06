import React from 'react'
import { formatDistance } from 'date-fns'
import { RouteComponentProps } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { gql } from '@apollo/client'

import {
	AppBar,
	Badge,
	Box,
	Button,
	Card,
	CardContent,
	CardActions,
	Typography,
	Paper,
	Tabs,
	Tab,
} from '@material-ui/core'
import {
	Email as EmailIcon,
	EventNote as EventNoteIcon,
	Collections as CollectionsIcon,
	Group as GroupIcon,
	AccessibleForward as AccessibleForwardIcon,
} from '@material-ui/icons'

import { useUserState } from '../../context/user'
import {
	useUserQuery,
	useIsUserOnlineSubscription,
} from '../../generated/types'
import useStyles from './Profile.style'
import EditProfile from '../../components/EditProfile'
import FollowUser from '../../components/FollowUser'
import BooksTab from './BooksTab'
import FollowersTab from './FollowersTab'
import FollowingsTab from './FollowingsTab'

type Props = RouteComponentProps<{ id: string }>

const Profile: React.FC<Props> = ({ match }) => {
	const [isEditing, setIsEditing] = React.useState<boolean>(false)
	const [tab, setTab] = React.useState(0)

	const toggleEditting = () => setIsEditing((initVal) => !initVal)
	const onTabChange = (e: any, value: number) => {
		setTab(value)
	}

	const { enqueueSnackbar } = useSnackbar()
	const state = useUserState()
	const user = state.data?.user

	const { data: subsData, loading: subsLoading } = useIsUserOnlineSubscription({
		variables: { userId: match.params.id },
		skip: String(user?.id) === match.params.id,
		onSubscriptionData: ({ client, subscriptionData }) => {
			client.writeFragment({
				id: `User:${match.params.id}`,
				fragment: gql`
					fragment IsOnline on User {
						isOnline
					}
				`,
				data: { isOnline: subscriptionData.data?.isUserOnline.isOnline },
			})
		},
	})

	const { data, loading } = useUserQuery({
		variables: { id: match.params.id },
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
	})

	let isOnline = data?.user?.isOnline
	if (!subsLoading && subsData) {
		isOnline = subsData.isUserOnline.isOnline
	}

	const classes = useStyles()

	if (loading) return <Typography variant="h6">Loading data...</Typography>
	if (!data?.user)
		return <Typography variant="h5">No data to display</Typography>

	return (
		<Box>
			<Card className={classes.profile} variant="outlined">
				<CardContent>
					<Box>
						<Box className={classes.avatar}>
							<Badge
								variant="dot"
								overlap="circle"
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'right',
								}}
								className={isOnline ? classes.online : ''}
							>
								<img
									className={classes.avatarImage}
									src={`http://localhost:4200/img/${data.user.avatar}`}
									alt="something"
								/>
							</Badge>
							<FollowUser className={classes.followIcon} user={data.user} />
						</Box>
						<Typography variant="h4" className={classes.name}>
							{data.user.name}
						</Typography>
					</Box>

					<Typography
						className={classes.info}
						variant="body2"
						color="textSecondary"
					>
						<EventNoteIcon className={classes.infoIcon} /> Joined{' '}
						{formatDistance(new Date(data.user.created), new Date())} ago
						<span className={classes.divider} />
						{data.user.email && (
							<React.Fragment>
								<EmailIcon className={classes.infoIcon} />
								{data.user.email}
							</React.Fragment>
						)}
					</Typography>
				</CardContent>

				{user?.id === match.params.id ? (
					<CardActions>
						<Button onClick={toggleEditting} color="primary" component="label">
							{isEditing ? 'Close Edit' : 'Edit Profile'}
						</Button>
					</CardActions>
				) : (
					''
				)}
			</Card>

			{isEditing && user?.id === match.params.id ? <EditProfile /> : ''}

			<Paper className={classes.menu} variant="outlined">
				<AppBar position="static">
					<Tabs
						className={classes.tabs}
						value={tab}
						onChange={onTabChange}
						variant="fullWidth"
					>
						<Tab icon={<CollectionsIcon />} label="Books" />
						<Tab
							icon={<GroupIcon />}
							label={`Followers (${data.user.followers})`}
						/>
						<Tab
							icon={<AccessibleForwardIcon />}
							label={`Followings (${data.user.followings})`}
						/>
					</Tabs>
				</AppBar>

				<Box>
					{tab === 0 && <BooksTab userId={data.user.id} />}
					{tab === 1 && <FollowersTab userId={data.user.id} />}
					{tab === 2 && <FollowingsTab userId={data.user.id} />}
				</Box>
			</Paper>
		</Box>
	)
}

export default Profile
