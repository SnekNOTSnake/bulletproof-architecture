import React from 'react'
import { formatDistance } from 'date-fns'
import { RouteComponentProps } from 'react-router-dom'
import { useSnackbar } from 'notistack'

import {
	Avatar,
	Box,
	Button,
	Card,
	CardHeader,
	CardContent,
	CardActions,
	Grid,
	Typography,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
} from '@material-ui/core'
import {
	Email as EmailIcon,
	PermIdentity as IdentityIcon,
	Fingerprint as FingerprintIcon,
	SvgIconComponent,
} from '@material-ui/icons'

import { useUserState } from '../../context/user'
import { useUserQuery } from '../../generated/types'
import useStyles from './Profile.style'
import EditProfile from '../../components/EditProfile'

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
	const { user } = useUserState()

	const { data, loading } = useUserQuery({
		variables: { id: match.params.id },
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
	})

	if (loading) return <Typography variant="h6">Loading data...</Typography>
	if (!data?.user)
		return <Typography variant="h5">No data to display</Typography>

	return (
		<Box>
			<Grid container>
				<Grid item md={6} xs={12}>
					<Card variant="outlined">
						<CardHeader
							avatar={
								<Avatar
									alt={data.user.name}
									src={`http://localhost:4200/img/${data.user.avatar}`}
								/>
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
							</List>
						</CardContent>

						{user?.id === match.params.id ? (
							<CardActions>
								<Button
									onClick={toggleEditting}
									color="primary"
									component="label"
								>
									{isEditing ? 'Close Edit' : 'Edit Profile'}
								</Button>
							</CardActions>
						) : (
							''
						)}
					</Card>

					{isEditing && user?.id === match.params.id ? <EditProfile /> : ''}
				</Grid>
			</Grid>
		</Box>
	)
}

export default Profile
