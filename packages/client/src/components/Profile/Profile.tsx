import React from 'react'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import EmailIcon from '@material-ui/icons/Email'
import IdentityIcon from '@material-ui/icons/PermIdentity'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import { SvgIconComponent } from '@material-ui/icons'

type MyListProps = { icon: SvgIconComponent; text: string | Date }

const MyList: React.FC<MyListProps> = ({ icon: Icon, text }) => (
	<ListItem>
		<ListItemIcon>
			<Icon />
		</ListItemIcon>
		<ListItemText>{text}</ListItemText>
	</ListItem>
)

type Props = { user?: ITokenPayload }

const Profile: React.FC<Props> = ({ user }) => {
	if (!user)
		return <Typography variant="h5">You have to be logged in first</Typography>

	return (
		<Box>
			<Grid container>
				<Grid item>
					<Card>
						<CardHeader title={user.name} />
						<CardContent>
							<List>
								<MyList icon={IdentityIcon} text={user.id} />
								{user.email ? (
									<MyList icon={EmailIcon} text={user.email} />
								) : (
									''
								)}
								<MyList icon={AccessTimeIcon} text={user.joined} />
							</List>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	)
}

export default Profile
