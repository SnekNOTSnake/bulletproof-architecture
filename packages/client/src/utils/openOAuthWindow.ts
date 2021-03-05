type MessageEventHandler<T> = (e: MessageEvent<T>) => any

const openOAuthWindow = (
	url: string,
	title: string,
	onMessage: MessageEventHandler<{ source: string; payload: IAuthData }>,
) => {
	window.removeEventListener('message', onMessage)

	const features =
		'toolbar=no, menubar=no, width=600, height=700, top=100, left=100, origin=http://localhost:8080'
	const childWindow = window.open(url, title, features)

	window.addEventListener('message', onMessage)

	return childWindow
}

export default openOAuthWindow
