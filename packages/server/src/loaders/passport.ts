import { Application } from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GitHubStrategy } from 'passport-github2'
import myEmitter, { USER_SIGNUP } from '../events/events'
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
} from '../config'
import UserModel from '../models/User'

export default function initializePassport(app: Application) {
	app.use(passport.initialize())

	passport.use(
		new GoogleStrategy(
			{
				clientID: GOOGLE_CLIENT_ID,
				clientSecret: GOOGLE_CLIENT_SECRET,
				callbackURL: '/api/auth/google/callback',
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const name = profile.name!.givenName
					const email = profile.emails![0].value
					const user = await UserModel.findOne({ email })

					// Existing user
					if (user) return done(undefined, user)

					// New user
					const newUser = new UserModel({
						name,
						email,
						provider: 'google',
						googleId: profile.id,
					})

					await newUser.save()
					myEmitter.emit(USER_SIGNUP, { user: newUser })

					done(undefined, newUser)
				} catch (err) {
					done(err, false)
				}
			},
		),
	)

	passport.use(
		new GitHubStrategy(
			{
				clientID: GITHUB_CLIENT_ID,
				clientSecret: GITHUB_CLIENT_SECRET,
				callbackURL: '/api/auth/github/callback',
			},
			async (accessToken, refreshToken, profile: any, done) => {
				try {
					const name = profile.username
					const gitHubId = profile.id
					const user = await UserModel.findOne({ gitHubId })

					// Existing user
					if (user) return done(undefined, user)

					// New user
					const newUser = new UserModel({
						name,
						provider: 'gitHub',
						gitHubId,
					})

					await newUser.save()

					// If user give their email on GitHub, say "Hello" to them
					if (profile._json.email)
						myEmitter.emit(USER_SIGNUP, { user: newUser })

					done(undefined, newUser)
				} catch (err) {
					done(err, false)
				}
			},
		),
	)
}
