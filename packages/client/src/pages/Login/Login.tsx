import React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'

import Alert from '@material-ui/lab/Alert'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import LinkComponent from '@material-ui/core/Link'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import GoogleIcon from '../../assets/images/google.svg'
import GitHubIcon from '../../assets/images/github.svg'
import AuthService from '../../services/Auth'
import useStyles from './Login.style'

type InputChange = React.ChangeEvent<HTMLInputElement>
type FormSubmit = React.FormEvent<HTMLFormElement>

type Props = RouteComponentProps & { setCurrentUser: Function }

const Login: React.FC<Props> = ({ history, setCurrentUser }) => {
	const [email, setEmail] = React.useState<string>('')
	const [pass, setPass] = React.useState<string>('')
	const [error, setError] = React.useState<string | undefined>()

	const onEmailChange = (e: InputChange) => setEmail(e.currentTarget.value)
	const onPassChange = (e: InputChange) => setPass(e.currentTarget.value)

	const onOAuthLogin = async (strategy: 'google' | 'github') => {
		const user = await AuthService.oAuthLogin(strategy)
		setCurrentUser(user)
		history.push('/')
	}

	const onSubmit = async (e: FormSubmit) => {
		try {
			e.preventDefault()
			const result = await AuthService.login({ email, password: pass })
			setCurrentUser(result)
			history.push('/')
		} catch (err) {
			setError(err.response.data.message)
			setPass('')
		}
	}

	const classes = useStyles()

	return (
		<Box>
			<Grid container>
				<Grid item md={6} xs={12}>
					<Card variant="outlined">
						<form onSubmit={onSubmit}>
							<CardHeader title="Login" />
							<CardContent>
								{error ? (
									<Alert
										onClose={() => setError('')}
										className={classes.alert}
										severity="error"
									>
										{error}
									</Alert>
								) : (
									''
								)}
								<Box className={classes.oAuthBox}>
									<Button
										disableElevation
										onClick={() => onOAuthLogin('google')}
										className={classes.oAuthButton}
										color="primary"
										variant="contained"
										startIcon={
											<img className={classes.icon} src={GoogleIcon} alt="G" />
										}
									>
										Google
									</Button>
									<Button
										disableElevation
										onClick={() => onOAuthLogin('github')}
										className={classes.oAuthButton}
										color="primary"
										variant="contained"
										startIcon={
											<img className={classes.icon} src={GitHubIcon} alt="G" />
										}
									>
										GitHub
									</Button>
								</Box>
								<TextField
									className={classes.input}
									fullWidth
									variant="outlined"
									label="Email"
									value={email}
									onChange={onEmailChange}
								/>
								<TextField
									fullWidth
									type="password"
									variant="outlined"
									label="Password"
									value={pass}
									onChange={onPassChange}
								/>
							</CardContent>
							<CardActions>
								<Button
									disableElevation
									variant="contained"
									color="primary"
									type="submit"
								>
									Submit
								</Button>
								<Typography>
									Don't have an account?{' '}
									<LinkComponent component={Link} to="/signup">
										Sign up
									</LinkComponent>
									!
								</Typography>
							</CardActions>
						</form>
					</Card>
				</Grid>
			</Grid>
		</Box>
	)
}

export default Login
