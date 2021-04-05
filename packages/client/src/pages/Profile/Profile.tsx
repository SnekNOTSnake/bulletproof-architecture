import React from 'react'
import { formatDistance } from 'date-fns'
import { RouteComponentProps } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { gql } from '@apollo/client'

import {
	Avatar,
	Box,
	Button,
	Card,
	CardHeader,
	CardContent,
	CardActions,
	Typography,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Badge,
} from '@material-ui/core'
import {
	Email as EmailIcon,
	PermIdentity as IdentityIcon,
	Fingerprint as FingerprintIcon,
	SvgIconComponent,
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

type MyListProps = { icon: SvgIconComponent; text: string | Date }

const MyList: React.FC<MyListProps> = ({ icon: Icon, text }) => {
	const classes = useStyles()

	return (
		<ListItem>
			<ListItemIcon>
				<Icon />
			</ListItemIcon>
			<ListItemText className={classes.listItem}>{text}</ListItemText>
		</ListItem>
	)
}

type Props = RouteComponentProps<{ id: string }>

const Profile: React.FC<Props> = ({ match }) => {
	const [isEditing, setIsEditing] = React.useState<boolean>(false)

	const toggleEditting = () => setIsEditing((initVal) => !initVal)

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
			<Card variant="outlined">
				<CardHeader
					action={<FollowUser user={data.user} />}
					avatar={
						<Badge
							variant="dot"
							overlap="circle"
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'right',
							}}
							className={isOnline ? classes.online : ''}
						>
							<Avatar
								alt={data.user.name}
								src={`http://localhost:4200/img/${data.user.avatar}`}
							/>
						</Badge>
					}
					title={data.user.name}
					subheader={`Joined ${formatDistance(
						new Date(data.user.joined),
						new Date(),
					)} ago`}
				/>
				<CardContent>
					<List>
						<MyList icon={FingerprintIcon} text={data.user.id} />
						{data.user.email ? (
							<MyList icon={EmailIcon} text={data.user.email} />
						) : (
							''
						)}
						<MyList
							icon={IdentityIcon}
							text={
								data.user.bio
									? data.user.bio
									: 'This person has no bio of himself. Spooky!'
							}
						/>
						<MyList
							icon={GroupIcon}
							text={`${data.user.followers} followers`}
						/>
						<MyList
							icon={AccessibleForwardIcon}
							text={`${data.user.followings} followings`}
						/>
					</List>
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
		</Box>
	)
}

export default Profile
