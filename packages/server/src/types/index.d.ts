type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

type ReplaceReturnType<T extends (...a: any) => any, TNewReturn> = (
	...a: Parameters<T>
) => TNewReturn

// Extend Express' `req` object to contain `user` with an `id`
declare namespace Express {
	export interface Request {
		user?: {
			id: string
			name: string
			email: string
			joined: Date
		}
	}
}
