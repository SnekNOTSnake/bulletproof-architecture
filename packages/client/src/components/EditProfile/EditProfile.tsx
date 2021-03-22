import React from 'react'
import { useSnackbar } from 'notistack'
import { Redirect } from 'react-router-dom'

import {
	Box,
	Button,
	Card,
	CardHeader,
	CardContent,
	Grid,
	TextField,
	Typography,
} from '@material-ui/core'

import { useUserState, useUserDispatch } from '../../context/user'
import EditPassword from '../EditPassword'
import { useUpdateMeMutation } from '../../generated/types'
import useStyles from './EditProfile.style'

type FormSubmit = React.FormEvent<HTMLFormElement>
type FileChange = React.ChangeEvent<HTMLInputElement>
type InputChange = React.ChangeEvent<HTMLInputElement>

const EditProfile: React.FC = () => {
	const { user } = useUserState()
	const userDispatch = useUserDispatch()

	if (!user) return <Redirect to="/login" />

	const [name, setName] = React.useState<string>(user.name)
	const [bio, setBio] = React.useState<string | null | undefined>(user.bio)
	const [file, setFile] = React.useState<File | null>(null)
	const [progress, setProgress] = React.useState<number>(0)
	const [preview, setPreview] = React.useState<string>('')

	const fileInput = React.useRef<HTMLInputElement>(null)

	const { enqueueSnackbar } = useSnackbar()

	const reset = () => {
		setName(user.name)
		setBio(user.bio)
		setPreview('')
		setFile(null)
		setProgress(0)

		if (fileInput.current) fileInput.current.value = ''
	}

	const [mutate, { loading, data }] = useUpdateMeMutation({
		onCompleted: (result) => {
			userDispatch({
				type: 'SET_USER',
				payload: {
					...user,
					avatar: result.updateMe.avatar,
					name: result.updateMe.name,
					bio: result.updateMe.bio,
				},
			})
			enqueueSnackbar('Profile updated', { variant: 'success' })
			setPreview('')
			setFile(null)
			setProgress(0)

			if (fileInput.current) fileInput.current.value = ''
		},
		onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
	})

	const onSubmit = (e: FormSubmit) => {
		e.preventDefault()
		if ((!name && !bio) || loading) return

		let abort: any

		mutate({
			variables: { file, name, bio },
			context: {
				fetchOptions: {
					useUpload: true,
					onProgress: (ev: ProgressEvent) => {
						setProgress((ev.loaded / ev.total) * 100)
					},
					onAbortPossible: (abortHandler: any) => {
						abort = abortHandler
					},
				},
			},
		})

		return () => {
			if (!abort) return
			abort()
		}
	}

	const onNameChange = (e: InputChange) => setName(e.currentTarget.value)
	const onBioChange = (e: InputChange) => setBio(e.currentTarget.value)
	const onFileChange = async ({ currentTarget: { files } }: FileChange) => {
		try {
			if (!files?.length) return

			const file = files[0]
			const reader = new FileReader()

			const result = await new Promise<any>((resolve, reject) => {
				reader.readAsDataURL(new Blob([file]))
				reader.onload = () => resolve(reader.result)
				reader.onerror = () => reject(reader.error)
			})

			setPreview(result)
			setFile(file)
		} catch (err) {
			enqueueSnackbar(err, { variant: 'error' })
		}
	}

	const classes = useStyles()
	const avatar = `http://localhost:4200/img/${user?.avatar || 'default.jpg'}`

	return (
		<Box className={classes.root}>
			<Card variant="outlined">
				<CardHeader title="Edit Profile" />
				<CardContent>
					<Box className={classes.generals}>
						<form onSubmit={onSubmit}>
							<Grid className={classes.generalsContent} container spacing={2}>
								<Grid item xs={3}>
									<Card
										style={{
											backgroundImage: `url(${preview ? preview : avatar})`,
										}}
										className={classes.preview}
										variant="outlined"
									/>
								</Grid>
								<Grid item xs={9}>
									<TextField
										fullWidth
										label="Name"
										variant="outlined"
										value={name}
										onChange={onNameChange}
										className={classes.input}
									/>
									<TextField
										fullWidth
										label="Bio data"
										variant="outlined"
										value={bio}
										onChange={onBioChange}
										multiline
										className={classes.input}
									/>
									<Button
										variant="outlined"
										disabled={loading}
										color="primary"
										component="label"
									>
										Upload PFP
										<input
											ref={fileInput}
											onChange={onFileChange}
											type="file"
											accept="image/jpeg,image/png,image/gif"
											hidden
										/>
									</Button>
								</Grid>
							</Grid>
							<Button color="primary" type="submit">
								Save
							</Button>
							<Button onClick={reset} color="primary" type="button">
								Reset
							</Button>
							{loading && file ? (
								<Typography variant="body1">{Math.ceil(progress)}%</Typography>
							) : (
								''
							)}
						</form>
					</Box>
					<Box>
						<EditPassword />
					</Box>
				</CardContent>
			</Card>
		</Box>
	)
}

export default EditProfile
