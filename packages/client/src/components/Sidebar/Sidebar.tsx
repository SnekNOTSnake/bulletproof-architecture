import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import {
	Drawer,
	DrawerProps,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper,
} from '@material-ui/core'
import {
	Home as HomeIcon,
	People as PeopleIcon,
	Book as BookIcon,
	Explore as ExploreIcon,
	ChevronRight as ChevronRightIcon,
} from '@material-ui/icons'

import useStyles from './Sidebar.style'

const menu = [
	{ link: '/', icon: <HomeIcon />, text: 'Home' },
	{ link: '/create-book', icon: <BookIcon />, text: 'Create Book' },
	{ link: '/people', icon: <PeopleIcon />, text: 'People' },
	{ link: '/explore', icon: <ExploreIcon />, text: 'Explore' },
]

type Props = {
	isDesktop: boolean
	open: boolean
	onClose: () => void
}

const Sidebar: React.FC<Props> = ({ isDesktop, open, onClose }) => {
	const loc = useLocation()
	const classes = useStyles()

	const drawer = (
		<Drawer open={open} onClose={onClose} classes={{ paper: classes.paper }}>
			<div className={classes.drawerToolbar}>
				<ListItem onClick={onClose} button>
					<ListItemIcon>
						<ChevronRightIcon />
					</ListItemIcon>
				</ListItem>
			</div>

			<Divider />

			<List>
				{menu.map((item, i) => (
					<Link key={i} className={classes.listLink} to={item.link}>
						<ListItem
							onClick={onClose}
							selected={loc.pathname === item.link}
							button
						>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText>{item.text}</ListItemText>
						</ListItem>
					</Link>
				))}
			</List>
		</Drawer>
	)

	return isDesktop ? (
		<Paper variant="outlined">
			<List>
				{menu.map((item, i) => (
					<Link key={i} className={classes.listLink} to={item.link}>
						<ListItem selected={loc.pathname === item.link} button>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText>{item.text}</ListItemText>
						</ListItem>
					</Link>
				))}
			</List>
		</Paper>
	) : (
		drawer
	)
}

export default Sidebar
