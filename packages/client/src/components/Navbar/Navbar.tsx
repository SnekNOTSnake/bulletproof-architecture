import React from 'react'
import { useApolloClient, Reference, gql } from '@apollo/client'
import { Link, useHistory } from 'react-router-dom'

import {
	Box,
	Badge,
	Link as LinkComponent,
	Button,
	ButtonProps,
	IconButton,
	Menu,
	MenuItem,
} from '@material-ui/core'
import {
	Search as SearchIcon,
	NightsStay as NightStayIcon,
	Brightness7 as WbSunnyIcon,
	Notifications as NotificationsIcon,
	RestaurantMenu as RestaurantMenuIcon,
} from '@material-ui/icons'

import {
	useNotifCreatedSubscription,
	useReadNotifsMutation,
} from '../../generated/types'
import Notifications from '../Notifications'
import { useUserState, logoutUser, useUserDispatch } from '../../context/user'
import { useThemeDispatch, useThemeState } from '../../context/theme'
import useStyles from './Navbar.style'

type ClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>
type LinkButtonProps = { to: string; text: string }
type Props = { isDesktop: boolean; openSidebar: ButtonProps['onClick'] }

const LinkButton: React.FC<LinkButtonProps> = ({ to, text }) => (
	<LinkComponent underline="none" component={Link} to={to}>
		<Button color="inherit">{text}</Button>
	</LinkComponent>
)

const Navbar: React.FC<Props> = ({ isDesktop, openSidebar }) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
	const close = () => setAnchorEl(null)
	const open = (e: ClickEvent) => {
		setAnchorEl(e.currentTarget)
	}

	const [userAnchor, setUserAnchor] = React.useState<null | HTMLElement>(null)
	const closeUser = () => setUserAnchor(null)
	const openUser = (e: ClickEvent) => {
		setUserAnchor(e.currentTarget)
	}

	const apolloClient = useApolloClient()
	const history = useHistory()

	const { theme } = useThemeState()
	const dispatchTheme = useThemeDispatch()
	const { data } = useUserState()
	const dispatchUser = useUserDispatch()

	const [readNotif] = useReadNotifsMutation()

	useNotifCreatedSubscription({
		skip: !data,
		onSubscriptionData: ({ client, subscriptionData }) => {
			// Modify cache
			client.cache.modify({
				fields: {
					notifs: (existing) => {
						const nodes: Reference[] = []
						if (existing.nodes) nodes.push(...existing.nodes)

						const newNotifRef = client.cache.writeFragment({
							data: subscriptionData.data?.notifCreated,
							fragment: gql`
								fragment NewNotif on GetBook {
									id
									userSender {
										id
										name
									}
									type
									book {
										id
										title
									}
									review {
										id
										rating
										content
									}
									created
									read
								}
							`,
						})

						nodes.unshift(newNotifRef!)

						return { ...existing, nodes }
					},
				},
			})

			// If notifs popover is open, skip modifying `newNotifs`
			if (anchorEl) return readNotif()

			// Modify number of notifs badge
			dispatchUser({ type: 'INCREASE_NOTIFS' })
		},
	})

	const toggleTheme = () => dispatchTheme({ type: 'TOGGLE_THEME' })

	const logout = async () => {
		closeUser()
		await logoutUser(dispatchUser)
		await apolloClient.clearStore()
		history.push('/')
	}

	const classes = useStyles()

	return (
		<Box className={classes.root}>
			{anchorEl && data ? (
				<Notifications anchorEl={anchorEl} onClose={close} />
			) : (
				''
			)}

			<Menu
				id="simple-menu"
				anchorEl={userAnchor}
				keepMounted
				open={Boolean(userAnchor)}
				onClose={closeUser}
				classes={{ paper: classes.menu }}
			>
				<MenuItem
					component={Link}
					to={`/user/${data?.user.id}`}
					onClick={closeUser}
				>
					Profile
				</MenuItem>
				<MenuItem onClick={logout}>Logout</MenuItem>
			</Menu>

			{!isDesktop ? (
				<IconButton onClick={openSidebar} type="button" color="inherit">
					<RestaurantMenuIcon />
				</IconButton>
			) : (
				''
			)}

			{data ? (
				<Button color="inherit" type="button" onClick={openUser}>
					{data.user.name}
				</Button>
			) : (
				<React.Fragment>
					<LinkButton to="/login" text="Login" />
					<LinkButton to="/signup" text="Sign up" />
				</React.Fragment>
			)}

			<Box className={classes.grow} />

			<IconButton color="inherit" type="button" onClick={toggleTheme}>
				{theme === 'light' ? <WbSunnyIcon /> : <NightStayIcon />}
			</IconButton>

			{data ? (
				<IconButton color="inherit" onClick={open}>
					<Badge badgeContent={data.newNotifs} color="secondary">
						<NotificationsIcon />
					</Badge>
				</IconButton>
			) : (
				''
			)}

			<LinkComponent underline="none" component={Link} to="/search">
				<IconButton type="button" color="inherit">
					<SearchIcon />
				</IconButton>
			</LinkComponent>
		</Box>
	)
}

export default Navbar
