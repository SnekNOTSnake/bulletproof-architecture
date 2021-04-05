import React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { useSnackbar } from 'notistack'

import {
	Box,
	Button,
	Card,
	CardHeader,
	CardContent,
	CardActions,
	Link as LinkComponent,
	TextField,
	Typography,
} from '@material-ui/core'

import { useUserDispatch } from '../../context/user'
import GoogleIcon from '../../assets/images/google.svg'
import GitHubIcon from '../../assets/images/github.svg'
import AuthService from '../../services/Auth'
import useStyles from './Login.style'

type InputChange = React.ChangeEvent<HTMLInputElement>
type FormSubmit = React.FormEvent<HTMLFormElement>

type Props = RouteComponentProps

const Login: React.FC<Props> = ({ history }) => {
	const [email, setEmail] = React.useState<string>('')
	const [pass, setPass] = React.useState<string>('')

	const [loading, setLoading] = React.useState(false)

	const { enqueueSnackbar } = useSnackbar()
	const userDispatch = useUserDispatch()

	const onEmailChange = (e: InputChange) => setEmail(e.currentTarget.value)
	const onPassChange = (e: InputChange) => setPass(e.currentTarget.value)

	const onOAuthLogin = async (strategy: 'google' | 'github') => {
		const result = await AuthService.oAuthLogin(strategy)
		userDispatch({ type: 'SET_USER', payload: result })
		history.push('/')
	}

	const onSubmit = async (e: FormSubmit) => {
		try {
			e.preventDefault()
			if (loading) return

			setLoading(true)
			const result = await AuthService.login({ email, password: pass })
			userDispatch({ type: 'SET_USER', payload: result })
			history.push('/')
		} catch (err) {
			if (err.response) {
				// Normal error (like validations, wrong password, etc.)
				enqueueSnackbar(err.response.data.message, { variant: 'error' })
			} else {
				// Network error
				enqueueSnackbar(err.message, { variant: 'error' })
			}
			setPass('')
		} finally {
			setLoading(false)
		}
	}

	const classes = useStyles()

	return (
		<Box>
			<Card variant="outlined">
				<form onSubmit={onSubmit}>
					<CardHeader title="Login" />
					<CardContent>
						<Box className={classes.oAuthBox}>
							<Button
								disabled={loading}
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
								disabled={loading}
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
							disabled={loading}
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
		</Box>
	)
}

export default Login
