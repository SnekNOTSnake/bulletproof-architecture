import React from 'react'

import { Card, CardHeader, CardContent, Link } from '@material-ui/core'
import { GitHub as GitHubIcon } from '@material-ui/icons'

import { useThemeState } from '../../context/theme'
import useStyles from './About.style'

const About: React.FC = () => {
	const { theme } = useThemeState()
	const classes = useStyles({ light: theme === 'light' })

	return (
		<React.Fragment>
			<Card variant="outlined">
				<CardHeader title="About Bulletproof" />
				<CardContent>
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestias ex
					doloremque dolorem sequi vitae doloribus illo unde voluptates.
				</CardContent>
			</Card>

			<Card className={classes.sourceRoot} variant="outlined">
				<Link
					href="https://github.com"
					target="_blank"
					className={classes.source}
				>
					<GitHubIcon className={classes.sourceIcon} />
				</Link>
			</Card>
		</React.Fragment>
	)
}

export default About
