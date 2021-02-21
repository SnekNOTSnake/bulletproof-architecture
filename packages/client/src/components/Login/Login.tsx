import React from 'react'
import axios from 'axios'
import Cookie from 'universal-cookie'
import { Link } from 'react-router-dom'

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

import useStyles from './Login.style'

const cookie = new Cookie()
const login = (token: string) => {
	cookie.set('jwt', token)
	window.location.href = '/'
}

type InputChange = React.ChangeEvent<HTMLInputElement>
type FormSubmit = React.FormEvent<HTMLFormElement>

const Login: React.FC = () => {
	const [email, setEmail] = React.useState<string>('')
	const [pass, setPass] = React.useState<string>('')
	const [error, setError] = React.useState<string | undefined>()

	const onEmailChange = (e: InputChange) => setEmail(e.currentTarget.value)
	const onPassChange = (e: InputChange) => setPass(e.currentTarget.value)

	const onSubmit = async (e: FormSubmit) => {
		try {
			e.preventDefault()

			const res = await axios.post('http://localhost:4200/api/auth/signin', {
				email,
				password: pass,
			})

			return login(res.data.authData.token)
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
					<Card>
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
									<LinkComponent
										className={classes.oAuthButton}
										href="http://localhost:4200/api/auth/google"
									>
										<Button color="primary" variant="contained">
											Google
										</Button>
									</LinkComponent>
									<LinkComponent
										className={classes.oAuthButton}
										href="http://localhost:4200/api/auth/github"
									>
										<Button color="primary" variant="contained">
											GitHub
										</Button>
									</LinkComponent>
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
									className={classes.input}
									fullWidth
									type="password"
									variant="outlined"
									label="Password"
									value={pass}
									onChange={onPassChange}
								/>
							</CardContent>
							<CardActions>
								<Button variant="contained" color="primary" type="submit">
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
