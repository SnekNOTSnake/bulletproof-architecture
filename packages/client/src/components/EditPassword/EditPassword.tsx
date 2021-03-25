import React from 'react'
import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router-dom'

import { TextField, Button } from '@material-ui/core'

import { useUserDispatch } from '../../context/user'
import AuthService from '../../services/Auth'
import useStyles from './EditPassword.style'

type FormSubmit = React.FormEvent<HTMLFormElement>
type InputChange = React.ChangeEvent<HTMLInputElement>

const EditPassword: React.FC = () => {
	const [password, setPassword] = React.useState<string>('')
	const [newPassword, setNewPassword] = React.useState<string>('')

	const [loading, setLoading] = React.useState(false)

	const userDispatch = useUserDispatch()
	const { enqueueSnackbar } = useSnackbar()
	const history = useHistory()

	const onPasswordChange = (e: InputChange) =>
		setPassword(e.currentTarget.value)
	const onNewPasswordChange = (e: InputChange) =>
		setNewPassword(e.currentTarget.value)

	const onSubmit = async (e: FormSubmit) => {
		try {
			e.preventDefault()
			setLoading(true)
			await AuthService.editPassword({ password, newPassword })
			userDispatch({ type: 'REMOVE_USER' })
			history.push('/')
		} catch (err) {
			if (err.response) {
				// Normal error (like validations, wrong password, etc.)
				enqueueSnackbar(err.response.data.message, { variant: 'error' })
			} else {
				// Network error
				enqueueSnackbar(err.message, { variant: 'error' })
			}
			setPassword('')
			setNewPassword('')
		} finally {
			setLoading(false)
		}
	}

	const classes = useStyles()

	return (
		<form onSubmit={onSubmit}>
			<TextField
				fullWidth
				label="Password"
				variant="outlined"
				value={password}
				onChange={onPasswordChange}
				className={classes.input}
			/>
			<TextField
				fullWidth
				label="New password"
				variant="outlined"
				value={newPassword}
				onChange={onNewPasswordChange}
				className={classes.input}
			/>
			<Button
				color="primary"
				variant="contained"
				disableElevation
				disabled={loading}
				type="submit"
			>
				Save
			</Button>
		</form>
	)
}

export default EditPassword
