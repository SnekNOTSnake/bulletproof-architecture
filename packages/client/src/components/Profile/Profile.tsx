import React from 'react'

type Props = { user?: ITokenPayload }

const Profile: React.FC<Props> = ({ user }) => {
	if (!user) return <div>You have to be logged in first</div>
	const renderEmail = user.email ? <li>Email: {user.email}</li> : ''

	return (
		<div className="Profile">
			<h2>{user.name}</h2>
			<ul>
				<li>ID: {user.id}</li>
				<li>Joined: {user.joined}</li>
				{renderEmail}
			</ul>
		</div>
	)
}

export default Profile
