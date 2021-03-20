import React from 'react'
import { formatDistance } from 'date-fns'
import { RouteComponentProps } from 'react-router-dom'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import EmailIcon from '@material-ui/icons/Email'
import IdentityIcon from '@material-ui/icons/PermIdentity'
import FingerprintIcon from '@material-ui/icons/Fingerprint'
import { SvgIconComponent } from '@material-ui/icons'

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

type Props = RouteComponentProps<{ id: string }> & {
	user?: IUser | null
	setCurrentUser: React.Dispatch<React.SetStateAction<IUser | null>>
}

const Profile: React.FC<Props> = ({ setCurrentUser, user, match }) => {
	const [isEditing, setIsEditing] = React.useState<boolean>(false)

	const toggleEditting = () => setIsEditing((initVal) => !initVal)

	const { data, loading, error } = useUserQuery({
		variables: { id: match.params.id },
	})

	if (loading) return <Typography variant="h6">Loading data...</Typography>
	if (error) return <Typography variant="h6">{error.message}</Typography>
	if (!data?.user)
		return <Typography variant="h5">No book with that ID</Typography>

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

					{isEditing && user?.id === match.params.id ? (
						<EditProfile setCurrentUser={setCurrentUser} user={user} />
					) : (
						''
					)}
				</Grid>
			</Grid>
		</Box>
	)
}

export default Profile
