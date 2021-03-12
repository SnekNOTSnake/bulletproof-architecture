import React from 'react'
import { formatDistance } from 'date-fns'

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
import { SvgIconComponent } from '@material-ui/icons'

import useStyles from './Profile.style'
import EditProfile from '../../components/EditProfile'

type MyListProps = { icon: SvgIconComponent; text: string | Date }

const MyList: React.FC<MyListProps> = ({ icon: Icon, text }) => (
	<ListItem>
		<ListItemIcon>
			<Icon />
		</ListItemIcon>
		<ListItemText>{text}</ListItemText>
	</ListItem>
)

type Props = {
	user: IUser | null
	setCurrentUser: React.Dispatch<React.SetStateAction<IUser | null>>
}

const Profile: React.FC<Props> = ({ user, setCurrentUser }) => {
	const [isEditing, setIsEditing] = React.useState<boolean>(false)

	const toggleEditting = () => setIsEditing((initVal) => !initVal)

	const classes = useStyles()

	if (!user)
		return <Typography variant="h5">You have to be logged in first</Typography>

	return (
		<Box>
			<Grid container>
				<Grid item md={6} xs={12}>
					<Card variant="outlined">
						<CardHeader
							avatar={
								<Avatar
									alt={user.name}
									src={`http://localhost:4200/img/${user.avatar}`}
								/>
							}
							title={user.name}
							subheader={`Joined ${formatDistance(
								new Date(user.joined),
								new Date(),
							)} ago`}
						/>
						<CardContent>
							<List>
								<MyList icon={IdentityIcon} text={user.id} />
								{user.email ? (
									<MyList icon={EmailIcon} text={user.email} />
								) : (
									''
								)}
							</List>
						</CardContent>
						<CardActions>
							<Button
								onClick={toggleEditting}
								color="primary"
								component="label"
							>
								{isEditing ? 'Close Edit' : 'Edit Profile'}
							</Button>
						</CardActions>
					</Card>
					{isEditing ? (
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
