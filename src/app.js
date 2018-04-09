if (process.env.NODE_ENV !== 'production') {
	console.log('Looks like we are in development mode!'); // eslint-disable-line no-console
}

function component() {
	let element = document.createElement('div');
	element.innerHTML = 'Hello webpack23';
	return element;
}

document.body.appendChild(component());