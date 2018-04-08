if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

function component() {
  var element = document.createElement('div');
  element.innerHTML = 'Hello webpack23';

  return element;
}

document.body.appendChild(component());