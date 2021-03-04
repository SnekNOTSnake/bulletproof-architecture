import { Observable } from 'apollo-link'

export default (promise: Promise<any>): any =>
	new Observable<any>((subscriber) => {
		promise.then(
			(value) => {
				if (subscriber.closed) return
				subscriber.next(value)
				subscriber.complete()
			},
			(err) => subscriber.error(err),
		)
	})
