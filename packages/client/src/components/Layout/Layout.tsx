import React from 'react'
import { SnackbarProvider } from 'notistack'
import { useTheme } from '@material-ui/core/styles'

import {
	CssBaseline,
	Container,
	Grid,
	IconButton,
	Typography,
} from '@material-ui/core'
import {
	ThemeProvider as MuiThemeProvider,
	createMuiTheme,
} from '@material-ui/core/styles'
import { Close as CloseIcon } from '@material-ui/icons'

import { useUserState, useUserDispatch, getAuthData } from '../../context/user'
import { useThemeState } from '../../context/theme'
import useStyles from './Layout.style'
import Navbar from '../Navbar'
import Sidebar from '../Sidebar'
import About from '../About'

const Layout: React.FC = ({ children }) => {
	const [windowWidth, setWindowWidth] = React.useState(window.innerWidth)
	window.addEventListener('resize', () => setWindowWidth(window.innerWidth))

	const [open, setOpen] = React.useState(false)
	const openSidebar = () => setOpen(true)
	const closeSidebar = () => setOpen(false)

	const { theme } = useThemeState()
	const userDispatch = useUserDispatch()
	const { loading, data } = useUserState()
	const defaultTheme = useTheme()

	const isDesktop = windowWidth >= defaultTheme.breakpoints.values.md

	React.useEffect(() => {
		getAuthData(userDispatch)
	}, [])

	const notistackRef = React.createRef<SnackbarProvider>()
	const onDismiss = (key: React.ReactText) => {
		if (notistackRef.current) notistackRef.current.closeSnackbar(key)
	}

	const muiTheme = React.useMemo(() => {
		return createMuiTheme({
			palette: {
				type: theme === 'light' ? 'light' : 'dark',
				background: {
					default: theme === 'light' ? '#eee' : '#202122',
					paper: theme === 'light' ? '#fff' : '#2c2f33',
				},
				primary: {
					main: theme === 'light' ? '#1976d2' : '#42a5f5',
					contrastText: '#fff',
				},
			},
			overrides: {
				MuiButton: {
					containedPrimary: {
						backgroundColor: '#1976d2',
					},
				},
				MuiAppBar: {
					colorPrimary: {
						backgroundColor: '#1976d2',
					},
				},
			},
		})
	}, [theme])

	const classes = useStyles()

	return (
		<MuiThemeProvider theme={muiTheme}>
			<SnackbarProvider
				ref={notistackRef}
				action={(key) => (
					<IconButton
						type="button"
						color="inherit"
						size="small"
						onClick={() => onDismiss(key)}
					>
						<CloseIcon />
					</IconButton>
				)}
				maxSnack={3}
			>
				<CssBaseline />
				<Container fixed className={classes.container}>
					{loading ? (
						<Typography variant="h6">Loading user</Typography>
					) : (
						<React.Fragment>
							<Navbar isDesktop={isDesktop} openSidebar={openSidebar} />

							<Grid container spacing={2}>
								{isDesktop ? (
									<Grid item xs={2}>
										<Sidebar
											isDesktop={isDesktop}
											open={open}
											onClose={closeSidebar}
										/>
									</Grid>
								) : (
									<Sidebar
										isDesktop={isDesktop}
										open={open}
										onClose={closeSidebar}
									/>
								)}

								<Grid item xs={isDesktop ? 7 : 12}>
									{children}
								</Grid>

								{isDesktop ? (
									<Grid item xs={3}>
										<About />
									</Grid>
								) : (
									''
								)}
							</Grid>
						</React.Fragment>
					)}
				</Container>
			</SnackbarProvider>
		</MuiThemeProvider>
	)
}

export default Layout
