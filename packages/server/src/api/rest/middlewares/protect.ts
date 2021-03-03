import { Container } from 'typedi'
import catchAsync from '../../../utils/catchAsync'
import { AUTH_KEY } from '../../../config'
import AuthService from '../../../services/Auth'

const protect = catchAsync(async (req, res, next) => {
	const token = req.cookies[AUTH_KEY] || req.headers[AUTH_KEY]
	if (!token) return next(new Error('You have to be logged in first'))

	const authServiceInstance = Container.get(AuthService)
	req.user = await authServiceInstance.protect(token)

	next()
})

export default protect
