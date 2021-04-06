import React from 'react'
import { Link } from 'react-router-dom'

import { Link as LinkComponent, Paper, Typography } from '@material-ui/core'

import useStyles from './SimplePerson.style'

type Props = {
	person: { id: string; name: string; avatar: string; email?: string | null }
}

const SimplePerson: React.FC<Props> = ({ person }) => {
	const classes = useStyles()

	return (
		<Paper className={classes.person} variant="outlined">
			<img
				className={classes.personAvatar}
				alt={person.name}
				src={`http://localhost:4200/img/${person.avatar}`}
			/>
			<LinkComponent
				className={classes.link}
				component={Link}
				to={`/user/${person.id}`}
			>
				<Typography variant="h6">{person.name}</Typography>
			</LinkComponent>
			{person.email && <Typography variant="body2">{person.email}</Typography>}
		</Paper>
	)
}

export default SimplePerson
