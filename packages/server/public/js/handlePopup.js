window.addEventListener('load', () => {
	const authData = JSON.parse(document.querySelector('#authData').innerHTML)
	const targetOrigin = document.querySelector('#targetOrigin').innerHTML

	if (window.opener) {
		window.opener.postMessage(authData, targetOrigin)
	}
	window.close()
})
